import { NftMarketplace } from '../generated/globalTypes';
import { uuid } from './common';
import { NftCollection } from './nft-collection';

export interface NftCollectionPrice {
  id: string;
  web: string;
  marketplace: NftMarketplace;
  marketplaceUrl: string;
  price: number;
  volume: number;
  supply: number;
  collection: NftCollection;
}

export type NftCollectionPriceChange = {
  id: uuid;
  price: number;
  volume: number;
  marketplace: NftMarketplace;
  date: string;
  collection: string;
};
