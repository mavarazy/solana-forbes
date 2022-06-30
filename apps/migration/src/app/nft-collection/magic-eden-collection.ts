import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { throttle } from '@forbex-nxr/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';
import * as Sentry from '@sentry/node';

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
  const url = `https://api-mainnet.magiceden.dev/v2/collections/${collection.symbol}/stats`;
  try {
    const { data: stats } = await axios.get<MagicEdenEscrowStats>(url);
    console.log('Got stats for ', collection.name);
    return stats;
  } catch (err) {
    console.warn(
      `${err.status}:magiceden.getMagicEdenEscrowStats: Failed url ${url}`
    );
    Sentry.captureException(err, {
      extra: {
        action: 'getMagicEdenEscrowStats',
        marketplace: NftMarketplace.magiceden,
        collection,
      },
    });
  }
  return null;
};

const getAllMagicEdenCollections = async (
  agg: MagicEdenCollection[] = []
): Promise<MagicEdenCollection[]> => {
  try {
    console.log('Sending request');
    const { data: collections } = await axios.get<MagicEdenCollection[]>(
      `https://api-mainnet.magiceden.dev/v2/collections?offset=${agg.length}&limit=500`
    );
    console.log('Fetched collection for ', collections.length);
    if (collections.length < 500) {
      return agg.concat(collections);
    }
    return getAllMagicEdenCollections(agg.concat(collections));
  } catch (err) {
    console.warn(
      `${err.status}:magiceden.getAllMagicEdenCollections: Failed offset ${agg.length}`
    );
    Sentry.captureException(err, {
      extra: {
        action: 'getAllMagicEdenCollections',
        marketplace: NftMarketplace.magiceden,
        offset: agg.length,
      },
    });
  }
  return [];
};

export const getMagicEdenPrices = async (): Promise<NftCollectionPrice[]> => {
  console.log('Getting collections');
  const collections = await getAllMagicEdenCollections();
  console.log('Number of collections ', collections.length);

  return await throttle(
    collections.map((collection) => async () => {
      const stats = await getMagicEdenEscrowStats(collection);
      if (!stats) {
        console.log(
          `Missing ${collection.name} https://magiceden.io/marketplace/${collection.symbol}`
        );
        return null;
      }

      console.log(stats.volumeAll);

      return {
        id: collection.symbol,
        marketplace: NftMarketplace.magiceden,
        name: collection.name,
        thumbnail: collection.image,
        symbol: collection.symbol,
        price: stats.floorPrice / LAMPORTS_PER_SOL || 0,
        website: `https://magiceden.io/marketplace/${collection.symbol}`,
        volume: Math.round(stats.volumeAll / LAMPORTS_PER_SOL) || 0,
        supply: collection.totalItems || stats.listedCount,
      };
    }),
    1000,
    10
  );
};
