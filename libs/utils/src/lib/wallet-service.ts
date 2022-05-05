import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { WalletBallance, TokenWorth } from './types';
import { PriceService } from './price-service';
import { throttle } from './throttle';
import { WalletRepository } from './wallet-repository';

const getTokens = async (accountId: string): Promise<TokenWorth[]> => {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new PublicKey(accountId),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  return Promise.all(
    tokenAccounts.value.map(async (accountBuffer) => {
      const account = AccountLayout.decode(accountBuffer.account.data);
      return PriceService.getTokenWorth(account);
    })
  );
};

const getSolBalance = async (accountId: string): Promise<bigint> => {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
  const publicKey = new PublicKey(accountId);
  const balance = await connection.getBalance(publicKey);

  return BigInt(balance);
};

const getWorth = async (sol: bigint, tokens: TokenWorth[]): Promise<number> => {
  const solWorth = await PriceService.getSolWorth(sol);
  const allTokenWorth = tokens.reduce((sum, token) => sum + token.worth, 0);
  return solWorth + allTokenWorth;
};

const getWalletBalance = async (id: string): Promise<WalletBallance> => {
  const sol = await getSolBalance(id);
  const tokens = await getTokens(id);
  const worth = await getWorth(sol, tokens);
  return {
    id,
    sol: Number(sol) / Math.pow(10, 9),
    tokens,
    worth,
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
    newWallets.map(
      (wallet, i) => async () => {
        console.log(`Extraxting ${i} wallet ${wallet}`);
        return WalletService.getWalletBalance(wallet)
      }
    ),
    1,
    1
  );

  WalletRepository.createWallets(freshWallets);

  return existingWallets.concat(freshWallets);
};

export const WalletService = {
  getWalletBalance,
  getAllWalletBalance,
};
