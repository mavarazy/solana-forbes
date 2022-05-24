import { TokenPrice } from '@forbex-nxr/types';

const getTokenWorth = (amount: number, price: TokenPrice) => {
  const baseWorth = amount * price.usd;
  if (price.cap === 0) {
    return Math.min(baseWorth, 100000);
  }

  if (price.supply && price.cap) {
    const percentCap = price.cap * (amount / price.supply);
    return Math.min(percentCap, baseWorth);
  }

  return amount * price.usd;
};

export const WorthUtils = {
  getTokenWorth,
};
