import { NftMarketplace } from '../generated/globalTypes';

export interface NftCollectionPrice {
  id: string;
  source: NftMarketplace;
  name: string;
  thumbnail?: string | null;
  symbol?: string | null;
  website?: string | null;
  price: number;
}
