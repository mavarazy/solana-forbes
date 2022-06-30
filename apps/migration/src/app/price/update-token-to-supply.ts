import { PriceService, throttle } from '@forbex-nxr/utils';
import { getMint } from '@solana/spl-token';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import * as Sentry from '@sentry/node';
import { writeFile } from 'fs/promises';

export const updateTokenToSupply = async () => {
  const pricedTokens = Object.values(
    await PriceService.getFullPriceMap()
  ).filter((token) => token.usd > 0);

  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  const tasks = pricedTokens.map((token) => async () => {
    try {
      const mint = await getMint(connection, new PublicKey(token.mint));

      return {
        mint: token.mint,
        decimals: mint.decimals,
        supply: Math.round(Number(mint.supply) / Math.pow(10, mint.decimals)),
      };
    } catch (err) {
      console.log('Failed to get mint', token.mint, ' ', err);
      Sentry.captureException(err, {
        extra: {
          action: 'updateTokenToSupply',
        },
      });
      return null;
    }
  });

  const tokens = await throttle(tasks, 2000, 5);

  const tokenByMint = tokens.reduce(
    (agg: { [key in string]: { decimals: number; supply: number } }, token) =>
      Object.assign(agg, {
        [token.mint]: { decimals: token.decimals, supply: token.supply },
      }),
    {}
  );

  await writeFile(
    './libs/utils/lib/token-to-supply.ts',
    `export const TokenToSupply = ${JSON.stringify(tokenByMint, null, 2)}`
  );
};
