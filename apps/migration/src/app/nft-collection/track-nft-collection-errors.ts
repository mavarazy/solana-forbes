import { NftMarketplace } from '@solana-forbes/types';
import * as Sentry from '@sentry/node';
import { AxiosError } from 'axios';

export const trackNftError = (
  err: AxiosError,
  marketplace: NftMarketplace,
  method: string,
  extra: { [key in string]: any }
) => {
  console.warn(`${err?.response?.status}:${marketplace}:${method} > ${extra}`);
  Sentry.captureException(err, {
    extra: {
      marketplace,
      method,
      ...extra,
    },
  });
};
