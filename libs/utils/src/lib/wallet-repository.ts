import { gql } from '@apollo/client';
import { WalletBallance } from './types';
import { hasuraClient } from './hasura-client';

const GetWalletsInQuery = gql`
  query GetWallets($wallets: [String!]) {
    wallet(where: { id: { _in: $wallets } }) {
      id
      worth
    }
  }
`;

const InsertWalletQuery = gql`
  mutation InsertWallet(
    $id: String!
    $worth: money!
    $sol: numeric!
    $tokens: jsonb!
  ) {
    insert_wallet_one(
      object: { worth: $worth, id: $id, sol: $sol, tokens: $tokens }
      on_conflict: { constraint: wallets_pkey, update_columns: worth }
    ) {
      id
      worth
      sol
      tokens
    }
  }
`;

const fetchExistingWallets = async (
  wallets: string[]
): Promise<WalletBallance[]> => {
  const { data } = await hasuraClient.query({
    query: GetWalletsInQuery,
    variables: {
      wallets: wallets.map((wallet) => wallet.toString()),
    },
  });

  return data.wallet as WalletBallance[];
};

const createWallets = async (wallets: WalletBallance[]) =>
  Promise.all(
    wallets.map(({ id, worth, sol, tokens }) =>
      hasuraClient.mutate({
        mutation: InsertWalletQuery,
        variables: { id, worth, sol, tokens },
      })
    )
  );

export const WalletRepository = {
  fetchExistingWallets,
  createWallets,
};
