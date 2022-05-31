import { gql } from '@apollo/client';
import { GetAllPricedTokens, TokenWorth } from '@forbex-nxr/types';
import { hasuraClient } from '@forbex-nxr/utils';
import { writeFile } from 'fs/promises';

export const GetAllPricedTokensQuery = gql`
  query GetAllPricedTokens {
    wallet(limit: 500, order_by: { worth: desc }) {
      tokens(path: "priced")
    }
  }
`;

export const updateTokenWorthSummary = async () => {
  const {
    data: { wallet },
  } = await hasuraClient.query<GetAllPricedTokens>({
    query: GetAllPricedTokensQuery,
  });

  const tokenMap = wallet.reduce(
    (agg: { [key in string]: TokenWorth & { count: number } }, { tokens }) => {
      tokens.forEach((token) => {
        if (agg[token.mint]) {
          agg[token.mint].amount += token.amount;
          agg[token.mint].percent += token.percent;
          agg[token.mint].worth += token.worth;
          agg[token.mint].count += 1;
        } else {
          agg[token.mint] = {
            ...token,
            percent: token.percent || 0,
            count: 1,
          };
        }
      });
      return agg;
    },
    {}
  );

  const topTokens = Object.values(tokenMap).sort((a, b) => b.worth - a.worth);

  await writeFile(
    './apps/app/utils/top-tokens.ts',
    'export const TopTokens = ' +
      JSON.stringify(topTokens.slice(0, 120), null, 2)
  );
};
