import { TokenPrice } from '@forbex-nxr/types';

const getTokenWorth = (amount: number, price: TokenPrice) => {
  if (price.supply && price.cap) {
    const percent = price.supply > 0 ? (100 * amount) / price.supply : 0;
    return percent > 0
      ? Math.min(
          price.usd * amount,
          (percent * Math.max(price.cap, price.usd * (price.supply / 10))) / 100
        )
      : price.usd * amount;
  } else {
    return amount * price.usd;
  }
};

export const WorthUtils = {
  getTokenWorth,
};
