import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { NFTService } from './nft-service';
import { TokenWorth, TokenWorthSummary } from '@forbex-nxr/types';
import { PriceService } from './price-service';

type AccountMap = { [key in string]: Pick<TokenWorth, 'mint' | 'amount'> };

const decodeTokens = (
  accounts: AccountInfo<Buffer>[]
): Pick<TokenWorth, 'mint' | 'amount'>[] => {
  const tokens = accounts.reduce((agg: AccountMap, account) => {
    const decodedAccount = AccountLayout.decode(account.data);
    const mint = decodedAccount.mint.toString();
    const amount = Number(decodedAccount.amount);
    if (agg[mint]) {
      agg[mint].amount += amount;
    } else {
      agg[mint] = { mint, amount };
    }
    return agg;
  }, {});

  return Object.values(tokens);
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
  const partialTokenWorth: Pick<TokenWorth, 'mint' | 'amount'>[] = decodeTokens(
    tokenAccounts.value.map(({ account }) => account)
  );

  const priceMap = await PriceService.getPriceMap(
    partialTokenWorth.map(({ mint }) => mint)
  );

  console.log(priceMap);

  const tokenWorth: TokenWorth[] = partialTokenWorth.map((token) => {
    const price = priceMap[token.mint];
    if (price) {
      const { usd, icon, name, decimals, supply } = price;
      const amount = token.amount / Math.pow(10, decimals);
      return {
        mint: token.mint,
        amount,
        info: {
          name: name || token.mint,
          logoURI: icon,
        },
        percent: supply && supply > 0 ? (100 * amount) / supply : 0,
        usd,
        worth: usd * amount,
      };
    } else {
      return {
        ...token,
        worth: 0,
      };
    }
  });

  const sortedTokens: TokenWorth[] = tokenWorth.sort(
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
  getTokenBalance,
};
