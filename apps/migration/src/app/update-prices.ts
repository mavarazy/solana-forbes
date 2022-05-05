import { PriceService, throttle } from '@forbex-nxr/utils';
import { TokenListProvider } from '@solana/spl-token-registry';

export const updatePrices = async () => {
  const resolvedTokens = await new TokenListProvider().resolve();
  const tasks = resolvedTokens
    .filterByClusterSlug('mainnet-beta')
    .getList()
    .filter((token) => token.extensions?.coingeckoId)
    .map((token) => async () => PriceService.loadTokenPrice(token));

  const prices = await throttle(tasks, 1000, 1);

  const priceMap = prices.reduce((agg, price) =>
    price === null ? agg : Object.assign(agg, { [price.mint]: price })
  );

  console.log(JSON.stringify(priceMap));
};
