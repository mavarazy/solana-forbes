import { gql } from '@apollo/client';
import {
  hasuraClient,
  throttle,
  WalletRepository,
  WalletService,
} from '@forbex-nxr/utils';
import delay = require('delay');

export const GetAllWalletsQuery = gql`
  query GetAllWallets {
    wallet(order_by: { worth: desc }, offset: 487) {
      id
    }
  }
`;

export const updateWallets = async () => {
  const {
    data: { wallet },
  } = await hasuraClient.query({ query: GetAllWalletsQuery });

  const tasks = wallet.map(({ id }) => async () => {
    const doLoad = async (attempt = 1) => {
      try {
        console.log('Updating: start ', id);
        const wallet = await WalletService.getWalletBalance(id);
        console.log('Updating: got balance ', id);

        await WalletRepository.updateWallet(wallet);

        console.log('Updating: done ', id);
      } catch (err) {
        console.log(err);
        if (attempt < 5) {
          console.log('Trying again in 1 minute');
          delay(attempt * 60000);
          doLoad(attempt + 1);
        }
      }
    };
    await doLoad();
  });

  console.log('Started');
  await throttle(tasks, 1000, 1);
  console.log('Done');
};
