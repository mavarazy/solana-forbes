import {
  GetAllWalletsUpdatedBefore,
  GetAllWalletsUpdatedBeforeVariables,
} from '@forbex-nxr/types';
import { hasuraClient, PriceService, throttle } from '@forbex-nxr/utils';
import delay = require('delay');
import { GetAllWalletsUpdatedBeforeQuery, UpdateDelay } from './update-wallets';
import { WalletRepository } from './wallet-repository';

export const updateWalletEvaluation = async () => {
  const {
    data: { wallet },
  } = await hasuraClient.query<
    GetAllWalletsUpdatedBefore,
    GetAllWalletsUpdatedBeforeVariables
  >({
    query: GetAllWalletsUpdatedBeforeQuery,
    variables: {
      updatedBefore: new Date(Date.now() - UpdateDelay).toISOString(),
    },
  });

  const tasks = wallet.map(({ id }) => async () => {
    const doLoad = async (attempt = 1) => {
      try {
        const wallet = await WalletRepository.getById(id);

        const tokens = wallet.tokens.priced
          .concat(wallet.tokens.general)
          .concat(wallet.tokens.dev);

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
