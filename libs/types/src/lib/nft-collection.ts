export interface NftCollection {
  web: string;
  name: string;
  social: NftCollectionSocial;
  description?: string;
  parent?: string;
  thumbnail?: string | null;
  symbol?: string | null;
}

export interface NftCollectionSocial {
  web: string;
  twitter?: string;
  discord?: string;
  instagram?: string;
  telegram?: string;
}
