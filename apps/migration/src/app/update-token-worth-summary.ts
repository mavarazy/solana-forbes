import { gql } from '@apollo/client';
import { GetAllPricedTokens, TokenWorth } from '@solana-forbes/types';
import { hasuraClient } from '@solana-forbes/utils';

const GetAllPricedTokensQuery = gql`
  query GetAllPricedTokens {
    wallet(limit: 500, order_by: { worth: desc }) {
      tokens(path: "priced")
    }
  }
`;

const UpdateTokenWorthSummaryQuery = gql`
  mutation UpdateTokenWorthSummary(
    $objects: [token_worth_summary_insert_input!]!
  ) {
    delete_token_worth_summary(where: {}) {
      returning {
        mint
      }
    }
    insert_token_worth_summary(objects: $objects) {
      returning {
        mint
      }
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

  await hasuraClient.mutate({
    mutation: UpdateTokenWorthSummaryQuery,
    variables: { objects: topTokens },
  });
};
