import {
  GetAllWalletsUpdatedBefore,
  GetAllWalletsUpdatedBeforeVariables,
} from '@forbex-nxr/types';
import { hasuraClient, throttle, WalletService } from '@forbex-nxr/utils';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import delay from 'delay';
import { GetAllWalletsUpdatedBeforeQuery } from './update-wallets';
import { WalletRepository } from './wallet-repository';
import * as Sentry from '@sentry/node';

export const updateWalletEvaluation = async () => {
  const {
    data: { wallet },
  } = await hasuraClient.query<
    GetAllWalletsUpdatedBefore,
    GetAllWalletsUpdatedBeforeVariables
  >({
    query: GetAllWalletsUpdatedBeforeQuery,
    variables: {
      updatedBefore: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
  });

  const connection: Connection = new Connection(
    clusterApiUrl('mainnet-beta'),
    'confirmed'
  );

  const tasks = wallet.map(({ id }) => async () => {
    const doLoad = async (attempt = 1) => {
      try {
        const wallet = await WalletRepository.getById(id);

        const updatedWallet = await WalletService.updateWalletBalance(
          connection,
          wallet
        );

        await WalletRepository.updateWallet(updatedWallet);

        console.log('Updating: done for ', id);
        return updatedWallet;
      } catch (err) {
        Sentry.captureException(err, {
          extra: {
            action: 'updateWalletEvaluation',
            id,
          },
        });
        console.log(err);
        if (attempt < 20) {
          console.log(`Trying again in ${attempt} minute`);
          await delay(attempt * 60000);
          doLoad(attempt + 1);
        }
      }
    };
    await doLoad();
  });

  console.log('Started');
  await throttle(tasks, 10, 1);
  console.log('Done');
};
