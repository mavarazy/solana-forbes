import { gql } from '@apollo/client';
import { hasuraClient, throttle, WalletService } from '@forbex-nxr/utils';

const GetAllWalletsQuery = gql`
  query GetAllWallets {
    wallet(order_by: { worth: desc }, offset: 1830) {
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
    try {
      console.log('Updating: start ', id);
      const balance = await WalletService.getWalletBalance(id);
      console.log('Updating: got balance ', id);

      await hasuraClient.mutate({
        mutation: UpdateWalletByIdQuery,
        variables: balance,
      });

      console.log('Updating: done ', id);
    } catch (err) {
      console.log(err);
    }
  });

  console.log('Started');
  await throttle(tasks, 1000, 2);
  console.log('Done');
};
