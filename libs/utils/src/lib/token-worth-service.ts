import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { NFTService } from './nft-service';
import { PriceService } from './price-service';
import { TokenWorth, TokenWorthSummary } from './types';

const asSolToken = (sol: bigint): TokenWorth => {
  const amount = Number(sol) / Math.pow(10, 9);
  return {
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
};

const getTokenBalance = async (
  accountId: string,
  sol: bigint
): Promise<TokenWorthSummary> => {
  const solToken: TokenWorth = asSolToken(sol);

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
    {
      [solToken.mint]: solToken,
    }
  );

  const sortedTokens: TokenWorth[] = Object.values(tokenMap).sort(
    (a: TokenWorth, b: TokenWorth) => {
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
    }
  );

  const nfts = await NFTService.loadNfts(
    sortedTokens.filter(
      (token) => (token.amount === 1 || token.amount === 0) && !token.usd
    )
  );
  const ftTokens = sortedTokens.filter(
    (token) => !nfts.some((nft) => token.mint === nft.mint)
  );

  const priced = ftTokens.filter((token) => token.worth > 0);
  const general = ftTokens.filter(
    (token) => token.worth === 0 && token.info && !token.usd
  );

  const dev = ftTokens.filter((token) => token.worth === 0 && !token.info);

  return {
    priced,
    general,
    dev,
    nfts,
  };
};

export const TokenWorthService = {
  getTokenBalance,
};
