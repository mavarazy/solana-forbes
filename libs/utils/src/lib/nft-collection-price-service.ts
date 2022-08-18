import { NftCollectionPrice } from '@solana-forbes/types';
import { Prices } from './nft-collection-price-map';

type NftCollectionPriceProjection = Pick<
  NftCollectionPrice,
  'price' | 'marketplace'
>;

type NftCollectionPriceMap = {
  [key in string]: NftCollectionPriceProjection;
};

const PriceMap: NftCollectionPriceMap = (
  Prices as Array<
    Pick<NftCollectionPrice, 'name' | 'symbol' | 'price' | 'marketplace'>
  >
).reduce((agg: NftCollectionPriceMap, nftPrice) => {
  const price: NftCollectionPriceProjection = {
    price: nftPrice.price,
    marketplace: nftPrice.marketplace,
  };
  if (nftPrice.name) {
    agg[nftPrice.name] = price;
  }
  if (nftPrice.symbol) {
    agg[nftPrice.symbol] = price;
  }
  return agg;
}, {});

const getFloorPrice = async (
  names: string[]
): Promise<NftCollectionPriceProjection | null> => {
  const nft_collection_price = names
    .map((name) => PriceMap[name.toLowerCase().trim()])
    .filter((price) => price !== null);

  if (nft_collection_price.length > 1) {
    console.log(`More than 1 nft matched to collection ${names.join(' | ')}`);
  }

  return nft_collection_price.length > 0 ? nft_collection_price[0] : null;
};

const getFloorPriceMap = async (
  names: string[]
): Promise<Map<string, NftCollectionPriceProjection>> => {
  return names.reduce((agg, name) => {
    const key = name.toLowerCase().trim();
    const price = PriceMap[key];
    if (price) {
      agg.set(key, price);
    }
    return agg;
  }, new Map<string, NftCollectionPriceProjection>());
};

export const NftCollectionWorthService = {
  getFloorPrice,
  getFloorPriceMap,
};
