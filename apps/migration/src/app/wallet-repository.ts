import { gql } from '@apollo/client';
import {
  AdminGetWalletById,
  AdminGetWalletByIdVariables,
  GetWallets,
  GetWalletsVariables,
  InsertWallet,
  InsertWalletVariables,
  UpdateWalletById,
  UpdateWalletByIdVariables,
  WalletBallance,
} from '@forbex-nxr/types';
import { hasuraClient } from '@forbex-nxr/utils';

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
    $tokens: jsonb!
    $worth: numeric!
    $program: Boolean!
  ) {
    insert_wallet_one(
      object: {
        id: $id
        sol: $sol
        summary: $summary
        tokens: $tokens
        worth: $worth
        program: $program
      }
      on_conflict: { constraint: wallets_pkey, update_columns: worth }
    ) {
      id
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
    $tokens: jsonb!
    $worth: numeric!
    $program: Boolean!
  ) {
    update_wallet_by_pk(
      pk_columns: { id: $id }
      _set: {
        tokens: $tokens
        worth: $worth
        sol: $sol
        summary: $summary
        program: $program
      }
    ) {
      id
      tokens
      program
      worth
      sol
      summary
    }
  }
`;

const AdminGetWalletByIdQuery = gql`
  query AdminGetWalletById($id: String!) {
    wallet_by_pk(id: $id) {
      id
      sol
      worth
      tokens
      summary
      program
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

const getById = async (id: string): Promise<WalletBallance> => {
  const {
    data: { wallet_by_pk: wallet },
  } = await hasuraClient.query<AdminGetWalletById, AdminGetWalletByIdVariables>(
    {
      query: AdminGetWalletByIdQuery,
      variables: { id },
    }
  );

  return wallet;
};

export const WalletRepository = {
  getById,
  fetchExistingWallets,
  createWallet,
  createWalletsInBatch,
  updateWallet,
};
