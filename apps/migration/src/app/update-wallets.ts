import { gql } from '@apollo/client';
import { hasuraClient, throttle, WalletService } from '@forbex-nxr/utils';

const GetAllWalletsQuery = gql`
  query GetAllWallets {
    wallet(order_by: { id: desc }, offset: 0) {
      id
    }
  }
`;

const UpdateWalletByIdQuery = gql`
  mutation UpdateWalletById(
    $id: String!
    $top: jsonb!
    $tokens: jsonb!
    $worth: money!
  ) {
    update_wallet_by_pk(
      pk_columns: { id: $id }
      _set: { top: $top, tokens: $tokens, worth: $worth }
    ) {
      id
    }
  }
`;

export const updateWallets = async () => {
  const {
    data: { wallet },
  } = await hasuraClient.query({ query: GetAllWalletsQuery });

  const tasks = wallet.map(({ id }) => async () => {
    console.log('Updating: start ', id);
    const balance = await WalletService.getWalletBalance(id);
    console.log('Updating: got balance ', id);

    await hasuraClient.mutate({
      mutation: UpdateWalletByIdQuery,
      variables: balance,
    });

    console.log('Updating: done ', id);
  });

  console.log('Started');
  await throttle(tasks, 1, 2);
  console.log('Done');
};
