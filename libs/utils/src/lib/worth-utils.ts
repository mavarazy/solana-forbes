import { TokenPrice } from './types';

const getTokenWorth = (amount: number, price: TokenPrice) => {
  const percent = price.supply > 0 ? (100 * amount) / price.supply : 0;
  return percent > 0
    ? Math.min(
        price.usd * amount,
        (percent * Math.max(price.cap, price.usd * (price.supply / 10))) / 100
      )
    : price.usd * amount;
};

export const WorthUtils = {
  getTokenWorth,
};
