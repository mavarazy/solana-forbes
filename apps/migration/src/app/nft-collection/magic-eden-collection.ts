import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { throttle } from '@forbex-nxr/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import delay from 'delay';
import fetch from 'node-fetch';

interface MagicEdenCollection {
  symbol: string;
  categories: string[];
  createdAt: string;
  derivativeDetails: { originName: string; originLink: string };
  description: string;
  discord: string;
  enabledAttributesFilters: boolean;
  image: string;
  isDerivative: boolean;
  name: string;
  totalItems: number;
  twitter: string;
  updatedAt: string;
  watchlistCount: number;
  volumeAll: number;
}

interface MagicEdenAttributes {
  count: number;
  floor: number;
  attribute: { trait_type: string; value: string };
}

interface MagicEdenEscrowStats {
  symbol: string;
  enabledAttributesFilters: boolean;
  availableAttributes: MagicEdenAttributes[];
  avgPrice24hr: number;
  floorPrice: number;
  listedCount: number;
  listedTotalValue: number;
  volume24hr: number;
  volumeAll: number;
}

const getMagicEdenEscrowStats = async (
  collection: MagicEdenCollection
): Promise<MagicEdenEscrowStats | null> => {
  const res = await fetch(
    `https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/${collection.symbol}?edge_cache=true`
  );
  if (res.ok) {
    return ((await res.json()) as { results: MagicEdenEscrowStats }).results;
  }
  if (res.status === 429) {
    console.log(`Retrying ${collection.symbol}`);
    await delay(30000);
    return getMagicEdenEscrowStats(collection);
  }

  return null;
};

const getAllMagicEdenCollections = async (): Promise<MagicEdenCollection[]> => {
  try {
    console.log('Sending request');
    const res = await fetch(
      'https://api-mainnet.magiceden.io/all_collections_with_escrow_data?edge_cache=true'
    );
    console.log('Got reponse');
    const { collections } = (await res.json()) as {
      collections: MagicEdenCollection[];
    };
    console.log('Fetched collection for ', collections.length);
    return collections;
  } catch (err) {
    console.log(err);
  }
  return [];
};

export const getMagicEdenCollections = async (): Promise<
  NftCollectionPrice[]
> => {
  console.log('Getting collections');
  const collections = await getAllMagicEdenCollections();

  const nftCollectionPrices = await throttle<NftCollectionPrice | null>(
    collections.map((collection) => async () => {
      const stats = await getMagicEdenEscrowStats(collection);
      if (!stats) {
        console.log(
          `Missing ${collection.name} https://magiceden.io/marketplace/${collection.symbol}`
        );
        return null;
      }

      return {
        id: collection.symbol,
        marketplace: NftMarketplace.magiceden,
        name: collection.name,
        thumbnail: collection.image,
        symbol: collection.symbol,
        price: stats.floorPrice / LAMPORTS_PER_SOL,
        website: `https://magiceden.io/marketplace/${collection.symbol}`,
        volume: stats.volumeAll,
        supply: stats.listedTotalValue,
      };
    }),
    1000,
    10
  );

  return nftCollectionPrices.filter((nft) => nft !== null);
};
