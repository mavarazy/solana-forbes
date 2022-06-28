import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { UpdateStream } from './update-stream';

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

interface AlphaArtCollectionDetails {
  collection: {
    id: string;
    addedAt: string;
    alternativeAuthorities: string[];
    authorityPubkey: string;
    banner: string;
    collaborators: string[];
    description: string;
    links: string[];
    ownerCount: number;
    slug: string;
    symbol: string;
    thumbnail: string;
    title: string;
    totalItems: number;
    verified: boolean;
    volume: string;
  };
  floorPrice: string;
}

const getCollectionDetails = async (collection: AlphaArtCollection) => {
  const detailsRes = await fetch(
    `https://apis.alpha.art/api/v1/collection/${collection.slug}`
  );
  if (!detailsRes) {
    return null;
  }
  return (await detailsRes.json()) as AlphaArtCollectionDetails;
};

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

export const getAlphArtCollections = async (
  updateStream: UpdateStream<NftCollectionPrice>
): Promise<NftCollectionPrice[]> => {
  const collections = await getAllAlphaArtCollections();
  console.log('Fetched ', collections.length);

  const nftPrices = await Promise.all(
    collections.map<Promise<NftCollectionPrice | null>>(async (collection) => {
      const details = await getCollectionDetails(collection);
      const price = parseInt(details.floorPrice);
      const volume = parseInt(details.collection.volume);
      if (price === 0) {
        return null;
      }

      const collectionPrice = {
        id: collection.id,
        marketplace: NftMarketplace.alphart,
        name: collection.title,
        thumbnail: collection.thumbnail,
        symbol: collection.slug,
        price: price / LAMPORTS_PER_SOL || 0,
        volume: volume / LAMPORTS_PER_SOL || 0,
        website: `https://alpha.art/collection/${collection.slug}`,
        supply: collection.totalItems,
      };

      return await updateStream.update(collectionPrice);
    })
  );

  return nftPrices.filter((nft): nft is NftCollectionPrice => nft !== null);
};
