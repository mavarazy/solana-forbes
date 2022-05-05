import { throttle, USDPriceMap } from '@forbex-nxr/utils';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

export const updateDecimals = async () => {
  const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

  const tasks = Object.entries(USDPriceMap).map(([mint, info]) => async () => {
    try {
      const { decimals } = await getMint(connection, new PublicKey(mint));
      return { ...info, mint, decimals };
    } catch (err) {
      return { ...info, mint };
    }
  });

  const mints = await throttle(tasks, 1, 10);

  const priceMap = mints.reduce(
    (agg, { mint, ...rest }) => Object.assign(agg, { [mint]: rest }),
    {}
  );

  console.log(JSON.stringify(priceMap));
};
