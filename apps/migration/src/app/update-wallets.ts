import { gql } from '@apollo/client';
import {
  hasuraClient,
  throttle,
  WalletRepository,
  WalletService,
} from '@forbex-nxr/utils';

const GetAllWalletsQuery = gql`
  query GetAllWallets {
    wallet(order_by: { worth: desc }, offset: 24) {
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
      const wallet = await WalletService.getWalletBalance(id);
      console.log('Updating: got balance ', id);

      await WalletRepository.updateWallet(wallet);

      console.log('Updating: done ', id);
    } catch (err) {
      console.log(err);
    }
  });

  console.log('Started');
  await throttle(tasks, 500, 1);
  console.log('Done');
};
