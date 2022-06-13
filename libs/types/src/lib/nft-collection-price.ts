import { NftMarketplace } from '../generated/globalTypes';

export interface NftCollectionPrice {
  id: string;
  marketplace: NftMarketplace;
  name: string;
  parent?: string;
  thumbnail?: string | null;
  symbol?: string | null;
  website?: string | null;
  price: number;
  volume: number;
  supply: number;
}
