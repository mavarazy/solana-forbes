import { TokenPrice, TokenWorthSummary } from '@solana-forbes/types';

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

const getWalletWorth = (
  solPrice: number,
  sol: number,
  tokens: TokenWorthSummary
): number => {
  const totalSols = tokens.nfts.reduce(
    (sum, nft) => (nft.owns ? nft.floorPrice || 0 : 0) + sum,
    sol
  );

  return tokens.priced.reduce(
    (worth, token) => worth + token.worth,
    totalSols * solPrice
  );
};

export const WorthUtils = {
  getWalletWorth,
  getTokenWorth,
};
