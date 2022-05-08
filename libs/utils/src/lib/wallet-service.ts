import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { WalletBallance, TokenWorth } from './types';
import { PriceService } from './price-service';
import { throttle } from './throttle';
import { WalletRepository } from './wallet-repository';
import { NFTService } from './nft-service';

const getAllTokenWorth = async (accountId: string): Promise<TokenWorth[]> => {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new PublicKey(accountId),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  const tokens = await Promise.all(
    tokenAccounts.value.map(async (accountBuffer) => {
      const account = AccountLayout.decode(accountBuffer.account.data);
      return PriceService.getTokenWorth(account);
    })
  );

  // There might be more than one account for the same token
  const tokenMap = tokens.reduce(
    (agg: { [key in string]: TokenWorth }, token) => {
      if (agg[token.mint]) {
        agg[token.mint].amount += token.amount;
        if (agg[token.mint].percent) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          agg[token.mint].percent += token.percent;
        }
        agg[token.mint].worth += token.worth;
      } else {
        agg[token.mint] = token;
      }
      return agg;
    },
    {}
  );

  return Object.values(tokenMap).sort((a, b) => b.worth - a.worth);
};

const getSolBalance = async (accountId: string): Promise<bigint> => {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
  const publicKey = new PublicKey(accountId);
  const balance = await connection.getBalance(publicKey);

  return BigInt(balance);
};

const getWalletBalance = async (id: string): Promise<WalletBallance> => {
  const sol = await getSolBalance(id);
  const tokens = await getAllTokenWorth(id);

  const amount = Number(sol) / Math.pow(10, 9);
  const solTokenWallet: TokenWorth = {
    amount: amount,
    mint: 'So11111111111111111111111111111111111111112',
    info: {
      name: 'Wrapped SOL',
      logoURI:
        'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    },
    worth: amount * PriceService.getSolPrice(),
    usd: PriceService.getSolPrice(),
  };

  const allTokens: TokenWorth[] = tokens
    .concat([solTokenWallet])
    .sort((a: TokenWorth, b: TokenWorth) => {
      if (a.worth === b.worth) {
        if (b.info && a.info) {
          return a.info.name.localeCompare(b.info.name);
        } else if (b.info) {
          return 1;
        } else if (a.info) {
          return -1;
        } else {
          return 0;
        }
      }
      return b.worth - a.worth;
    });

  const nfts = await NFTService.loadNfts(
    allTokens.filter((token) => token.amount === 1 && !token.usd)
  );

  return {
    id,
    summary: {
      nfts: nfts.length,
      tokens: tokens.length - nfts.length,
    },
    sol: Number(sol) / Math.pow(10, 9),
    nfts,
    top: allTokens.slice(0, 3).filter((worth) => worth.usd),
    tokens: allTokens.filter((token) => !nfts.includes(token)),
    worth: allTokens.reduce((worth, token) => worth + token.worth, 0),
  };
};

const getAllWalletBalance = async (
  wallets: string[]
): Promise<WalletBallance[]> => {
  const existingWallets = await WalletRepository.fetchExistingWallets(wallets);

  const newWallets = wallets.filter(
    (topWallet) => !existingWallets.find((wallet) => wallet.id === topWallet)
  );

  console.log(`Found ${newWallets.length} new wallets`);
  const freshWallets = await throttle(
    newWallets.map((wallet, i) => async () => {
      console.log(`Extraxting ${i} wallet ${wallet}`);
      return WalletService.getWalletBalance(wallet);
    }),
    1000,
    1
  );

  WalletRepository.createWallets(freshWallets);

  return existingWallets.concat(freshWallets);
};

export const WalletService = {
  getWalletBalance,
  getAllWalletBalance,
};
