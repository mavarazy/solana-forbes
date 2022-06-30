import { updateNftCollectionPrice } from './app/nft-collection';
import { updateTokenWorthSummary } from './app/update-token-worth-summary';
import { updateWalletEvaluation } from './app/update-wallet-evaluation';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://1859802ae9d5487fa989701899175f35@o970258.ingest.sentry.io/6541229',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

axiosRetry(axios, {
  retries: 5,
  retryCondition: (e) => {
    console.log('Retrying ', e.config.url, ' ', e.status);
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(e) ||
      e.response.status === 429 ||
      e.response.status === 508
    );
  },
  retryDelay: (retryCount: number) => retryCount * 60000,
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
