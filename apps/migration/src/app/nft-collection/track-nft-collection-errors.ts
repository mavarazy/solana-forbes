import { NftMarketplace } from '@forbex-nxr/types';
import * as Sentry from '@sentry/node';

export const trackNftError = (
  marketplace: NftMarketplace,
  method: string,
  extra: { [key in string]: any },
  err
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
