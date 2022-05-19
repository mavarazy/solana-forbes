import { gql } from '@apollo/client';
import {
  GetWalletById,
  GetWalletByIdVariables,
  GetWallets,
  GetWalletsVariables,
  InsertWallet,
  InsertWalletVariables,
  UpdateWalletById,
  UpdateWalletByIdVariables,
  WalletBallance,
} from '@forbex-nxr/types';
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
    $sol: numeric!
    $summary: jsonb!
    $top: jsonb!
    $tokens: jsonb!
    $worth: numeric!
    $program: Boolean!
  ) {
    insert_wallet_one(
      object: {
        id: $id
        sol: $sol
        summary: $summary
        top: $top
        tokens: $tokens
        worth: $worth
        program: $program
      }
      on_conflict: { constraint: wallets_pkey, update_columns: worth }
    ) {
      id
      top
      tokens
      worth
      sol
      summary
      program
    }
  }
`;

const UpdateWalletByIdQuery = gql`
  mutation UpdateWalletById(
    $id: String!
    $sol: numeric!
    $summary: jsonb!
    $top: jsonb!
    $tokens: jsonb!
    $worth: numeric!
    $program: Boolean!
  ) {
    update_wallet_by_pk(
      pk_columns: { id: $id }
      _set: {
        top: $top
        tokens: $tokens
        worth: $worth
        sol: $sol
        summary: $summary
        program: $program
      }
    ) {
      id
      top
      tokens
      program
      worth
      sol
      summary
    }
  }
`;

const fetchExistingWallets = async (
  wallets: string[]
): Promise<WalletBallance[]> => {
  const { data } = await hasuraClient.query<GetWallets, GetWalletsVariables>({
    query: GetWalletsInQuery,
    variables: {
      wallets: wallets.map((wallet) => wallet.toString()),
    },
  });

  return data.wallet as WalletBallance[];
};

const createWallet = async (
  wallet: WalletBallance
): Promise<WalletBallance> => {
  const { data } = await hasuraClient.mutate<
    InsertWallet,
    InsertWalletVariables
  >({
    mutation: InsertWalletQuery,
    variables: wallet,
  });
  if (!data?.insert_wallet_one) {
    throw new Error(`Failed to create ${wallet.id}`);
  }
  return data.insert_wallet_one;
};

const createWalletsInBatch = async (wallets: WalletBallance[]) =>
  Promise.all(wallets.map(createWallet));

const updateWallet = async (
  wallet: WalletBallance
): Promise<WalletBallance> => {
  const { data } = await hasuraClient.mutate<
    UpdateWalletById,
    UpdateWalletByIdVariables
  >({
    mutation: UpdateWalletByIdQuery,
    variables: wallet,
  });
  if (data?.update_wallet_by_pk) {
    return data.update_wallet_by_pk;
  }
  return createWallet(wallet);
};

export const WalletRepository = {
  fetchExistingWallets,
  createWallet,
  createWalletsInBatch,
  updateWallet,
};
