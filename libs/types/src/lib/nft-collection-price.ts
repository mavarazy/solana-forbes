import { NftMarketplace } from '../generated/globalTypes';
import { uuid } from './common';

export interface NftCollectionPrice {
  id: string;
  marketplace: NftMarketplace;
  name: string;
  parent?: string;
  thumbnail?: string | null;
  symbol?: string | null;
  website: string;
  marketplaceUrl?: string | null;
  price: number;
  volume: number;
  supply: number;
}

export type NftCollectionPriceChange = {
  id: uuid;
  price: number;
  volume: number;
  marketplace: NftMarketplace;
  date: string;
  collection: string;
};
