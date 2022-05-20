import { AccountLayout, RawAccount, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TokenListProvider } from '@solana/spl-token-registry';
import { Connection, PublicKey } from '@solana/web3.js';
import { NFTService } from './nft-service';
import {
  TokenInfoSummary,
  TokenWorth,
  TokenWorthSummary,
} from '@forbex-nxr/types';
import { USDPriceMap } from './usd-price-map';

const tokenMap: Promise<{ [key in string]: TokenInfoSummary }> = new Promise(
  (resolve) => {
    new TokenListProvider().resolve().then((resolvedTokens) => {
      const tokenMap = resolvedTokens.getList().reduce(
        (agg, tokenInfo) =>
          Object.assign(agg, {
            [tokenInfo.address]: {
              name: tokenInfo.name,
              logoURI: tokenInfo.logoURI,
              decimals: tokenInfo.decimals,
            },
          }),
        {}
      );

      resolve(tokenMap);
    });
  }
);

const getTokenWorth = async (account: RawAccount): Promise<TokenWorth> => {
  const mint = account.mint.toString();
  const price = USDPriceMap[mint];
  const info = (await tokenMap)[mint] ?? null;
  if (price) {
    const { decimals, usd, cap } = price;
    const amount = Number(account.amount) / Math.pow(10, decimals);
    const percent = price.supply > 0 ? (100 * amount) / price.supply : 0;
    const worth =
      percent > 0
        ? Math.min(
            usd * amount,
            (percent * Math.max(cap, usd * (price.supply / 10))) / 100
          )
        : usd * amount;
    return {
      mint,
      amount,
      worth,
      info,
      usd: price.usd,
      percent,
    };
  } else {
    return {
      mint,
      info,
      amount: Number(account.amount) / Math.pow(10, info?.decimals ?? 0),
      worth: 0,
    };
  }
};

const getTokenBalance = async (
  connection: Connection,
  accountId: string
): Promise<TokenWorthSummary> => {
  console.log(accountId, ' retrieving tokens');
  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new PublicKey(accountId),
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  console.log(accountId, ' got ', tokenAccounts.value.length, ' tokens');
  const tokens = await Promise.all(
    tokenAccounts.value.map(async (accountBuffer) => {
      const account = AccountLayout.decode(accountBuffer.account.data);
      return getTokenWorth(account);
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
    connection,
    sortedTokens.filter(
      (token) =>
        (token.amount === 1 || token.amount === 0) &&
        !token.usd &&
        !token.info?.name
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
  getTokenWorth,
  getTokenBalance,
};
