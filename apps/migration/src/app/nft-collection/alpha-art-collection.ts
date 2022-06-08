import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface AlphaArtCollection {
  id: string;
  slug: string;
  title: string;
  thumbnail: string;
  totalItems: number;
  addedAt: string;
  listedCount: string;
  floorPrice: string;
}

const getAllAlphaArtCollections = async (
  agg: AlphaArtCollection[] = []
): Promise<AlphaArtCollection[]> => {
  const res = await fetch(
    `https://apis.alpha.art/api/v2/collection/list/collections?limit=24&offset=${agg.length}&order=title&dir=asc`
  );
  if (!res.ok) {
    return agg;
  }
  const items = (await res.json()) as AlphaArtCollection[];
  if (items.length < 24) {
    return agg.concat(items);
  }
  return getAllAlphaArtCollections(agg.concat(items));
};

export const getAlphArtCollections = async (): Promise<
  NftCollectionPrice[]
> => {
  const collections = await getAllAlphaArtCollections();
  console.log('Fetched ', collections.length);

  const nftPrices = collections.map<NftCollectionPrice | null>((collection) => {
    const price = parseInt(collection.floorPrice);
    if (price === 0) {
      return null;
    }
    return {
      id: collection.id,
      source: NftMarketplace.alphart,
      name: collection.title,
      thumbnail: collection.thumbnail,
      symbol: collection.slug,
      price: price / LAMPORTS_PER_SOL,
    };
  });

  return nftPrices.filter((nft): nft is NftCollectionPrice => nft !== null);
};
