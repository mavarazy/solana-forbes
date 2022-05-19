export type NftCollectionSource = 'digitaleyes' | 'exchageart' | 'fractal';

export interface NftCollectionPrice {
  id: string;
  source: NftCollectionSource;
  name: string;
  symbol?: string | null;
  website?: string | null;
  price: number;
}
