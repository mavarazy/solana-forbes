import { updateNftCollectionPrice } from './app/nft-collection';
import { updateTokenWorthSummary } from './app/update-token-worth-summary';
import { updateWalletEvaluation } from './app/update-wallet-evaluation';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
  retries: 5,
  retryCondition: (e) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(e) ||
      e.response.status === 429 ||
      e.response.status === 508
    );
  },
  retryDelay: axiosRetry.exponentialDelay,
});

const execute = async () => {
  try {
    await updateNftCollectionPrice();
    await updateWalletEvaluation();
    await updateTokenWorthSummary();
  } catch (err) {
    console.error(err);
  }
  console.log('Done');
};

execute().then(() => {
  console.log('Exit');
  process.exit(0);
});
