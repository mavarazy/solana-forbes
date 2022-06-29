import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';

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

const getCollectionDetails = async (
  collection: AlphaArtCollection
): Promise<AlphaArtCollectionDetails> => {
  try {
    const detailsRes = await axios.get<AlphaArtCollectionDetails>(
      `https://apis.alpha.art/api/v1/collection/${collection.slug}`
    );
    return detailsRes.data;
  } catch (err) {
    return null;
  }
};

const getAllAlphaArtCollections = async (
  agg: AlphaArtCollection[] = []
): Promise<AlphaArtCollection[]> => {
  try {
    const res = await axios.get<AlphaArtCollection[]>(
      `https://apis.alpha.art/api/v2/collection/list/collections?limit=24&offset=${agg.length}&order=title&dir=asc`
    );
    const items = res.data;
    if (items.length < 24) {
      return agg.concat(items);
    }
    return getAllAlphaArtCollections(agg.concat(items));
  } catch (err) {
    return agg;
  }
};

export const getAlphArtCollections = async (): Promise<
  NftCollectionPrice[]
> => {
  const collections = await getAllAlphaArtCollections();
  console.log('Fetched ', collections.length);

  const nftPrices = await Promise.all(
    collections.map<Promise<NftCollectionPrice | null>>(async (collection) => {
      const details = await getCollectionDetails(collection);
      if (details === null) {
        return null;
      }

      const floorPrice = parseInt(details.floorPrice);
      const volume = parseInt(details.collection.volume);
      if (floorPrice === 0) {
        return null;
      }

      const price = {
        id: collection.id,
        marketplace: NftMarketplace.alphart,
        name: collection.title,
        thumbnail: collection.thumbnail,
        symbol: collection.slug,
        price: floorPrice / LAMPORTS_PER_SOL || 0,
        volume: volume / LAMPORTS_PER_SOL || 0,
        website: `https://alpha.art/collection/${collection.slug}`,
        supply: collection.totalItems,
      };

      return price;
    })
  );

  return nftPrices.filter((nft): nft is NftCollectionPrice => nft !== null);
};
