export type NftCollectionSource = 'digitaleyes' | 'exchageart';

export interface NftCollectionPrice {
  id: string;
  source: NftCollectionSource;
  name: string;
  symbol?: string;
  website: string;
  price: number;
}
