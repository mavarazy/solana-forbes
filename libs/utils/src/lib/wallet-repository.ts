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
    $sol: numeric!
    $summary: jsonb!
    $nfts: jsonb!
    $top: jsonb!
    $tokens: jsonb!
    $worth: numeric!
  ) {
    insert_wallet_one(
      object: {
        id: $id
        sol: $sol
        summary: $summary
        nfts: $nfts
        top: $top
        tokens: $tokens
        worth: $worth
      }
      on_conflict: { constraint: wallets_pkey, update_columns: worth }
    ) {
      id
      top
      tokens
      worth
      sol
      nfts
      summary
    }
  }
`;

const UpdateWalletByIdQuery = gql`
  mutation UpdateWalletById(
    $id: String!
    $sol: numeric!
    $summary: jsonb!
    $nfts: jsonb!
    $top: jsonb!
    $tokens: jsonb!
    $worth: numeric!
  ) {
    update_wallet_by_pk(
      pk_columns: { id: $id }
      _set: {
        top: $top
        tokens: $tokens
        worth: $worth
        sol: $sol
        nfts: $nfts
        summary: $summary
      }
    ) {
      id
      top
      tokens
      worth
      sol
      nfts
      summary
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

const createWallet = async (wallet: WalletBallance) => {
  const {
    data: { insert_wallet_one },
  } = await hasuraClient.mutate({
    mutation: InsertWalletQuery,
    variables: wallet,
  });
  return insert_wallet_one;
};

const createWalletsInBatch = async (wallets: WalletBallance[]) =>
  Promise.all(wallets.map(createWallet));

const updateWallet = async (
  wallet: WalletBallance
): Promise<WalletBallance> => {
  const {
    data: { update_wallet_by_pk },
  } = await hasuraClient.mutate({
    mutation: UpdateWalletByIdQuery,
    variables: wallet,
  });
  if (update_wallet_by_pk) {
    return update_wallet_by_pk as WalletBallance;
  }
  return createWallet(wallet);
};

export const WalletRepository = {
  fetchExistingWallets,
  createWallet,
  createWalletsInBatch,
  updateWallet,
};
