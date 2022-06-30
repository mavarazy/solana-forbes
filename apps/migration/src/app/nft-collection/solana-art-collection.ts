import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { throttle } from '@forbex-nxr/utils';
import { Metaplex } from '@metaplex-foundation/js-next';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';
import * as Sentry from '@sentry/node';

interface SolanaArtCollection {
  id: number;
  img: string;
  imgpreview: string;
  name: string;
  regionfix: string;
  supply: number;
  description: string;
  discord: string;
  twitter: number;
  url: string;
  urlsoon: string;
  website: string;
  creators: string;
  collectionAddr: string;
}

interface SolanaArtVolume {
  category: string;
  collection: string;
  dailySales: number;
  dailyVolume: number;
  floorPrice: number;
  lastUpdated: number;
  listedTotal: number;
  ownerCount: number;
  prevDailySales: number;
  prevDailyVolume: number;
  prevWeeklySales: number;
  prevWeeklyVolume: number;
  totalSales: number;
  totalVolume: number;
  weeklySales: number;
  weeklyVolume: number;
}

interface SolanaArtPrice {
  countTotal: number;
  count_listed: number;
  floorPrice: number;
}

interface SolanaArtListedItem {
  id: number;
  token_add: string;
  price: number;
  link_img: string;
  for_sale: number;
  name: string;
  escrowAdd: string;
  ah: number;
  seller_address: string;
  attributes: string;
  rank: null | number;
  type: string;
  attrib_count: number;
  buyerAdd: null | string;
  bidder_address: null | string;
  currentBid: null | number;
  lastSoldPrice: null | number;
}

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
const metaplex = new Metaplex(connection);

const getCollectionSymbol = async (url: string): Promise<string | null> => {
  try {
    const {
      data: { items },
    } = await axios.get<{ items: SolanaArtListedItem[] }>(
      `https://api.solanart.io/get_nft?collection=${url}&page=0&limit=1&order=price-ASC&min=0&max=99999&search=&listed=true&fits=all`
    );

    if (items.length === 0) {
      return null;
    }

    const tokenAddr = items[0].token_add;
    const nft = await metaplex.nfts().findByMint(new PublicKey(tokenAddr));

    return nft.symbol;
  } catch (err) {
    Sentry.captureException(err, {
      extra: {
        action: 'getCollectionSymbol',
        marketplace: NftMarketplace.solanart,
        url,
      },
    });
    console.log('Failed to fetch NFT info for');
  }
  return null;
};

const getSolanaPrice = async (
  collection: SolanaArtCollection
): Promise<SolanaArtPrice> => {
  const url = `https://api.solanart.io/get_floor_price?collection=${collection.url}`;
  try {
    const { data: price } = await axios.get<SolanaArtPrice>(url);
    return price;
  } catch (err) {
    Sentry.captureException(err, {
      extra: {
        action: 'getSolanaPrice',
        marketplace: NftMarketplace.solanart,
        collection,
        url,
      },
    });
    return null;
  }
};

const getAllSolanaArtCollections = async (): Promise<SolanaArtCollection[]> => {
  try {
    console.log('Sending request');
    const { data: collections } = await axios.get<SolanaArtCollection[]>(
      'https://api.solanart.io/get_collections'
    );
    console.log('Fetched collection for ', collections.length);
    return collections;
  } catch (err) {
    Sentry.captureException(err, {
      extra: {
        action: 'getAllSolanaArtCollections',
        marketplace: NftMarketplace.solanart,
      },
    });
    console.log(err);
  }
  return [];
};

const getAllSolanaArtVolume = async (): Promise<SolanaArtVolume[]> => {
  try {
    console.log('Sending request');
    const { data: collections } = await axios.get<SolanaArtVolume[]>(
      'https://api.solanart.io/query_volume_all'
    );
    console.log('Fetched collection for ', collections.length);
    return collections;
  } catch (err) {
    Sentry.captureException(err, {
      extra: {
        action: 'getAllSolanaArtVolume',
        marketplace: NftMarketplace.solanart,
      },
    });
  }
  return [];
};

export const getSolanaArtCollections = async (): Promise<
  NftCollectionPrice[]
> => {
  console.log('Getting collections');
  const collections = await getAllSolanaArtCollections();

  const volume = await getAllSolanaArtVolume();

  const volumeByUrl: { [key in string]: SolanaArtVolume } = volume.reduce(
    (agg, volume) => Object.assign(agg, { [volume.collection]: volume }),
    {}
  );

  const collectionPriceTasks = collections.map((collection) => async () => {
    const symbol = await getCollectionSymbol(collection.url);
    const base: Omit<NftCollectionPrice, 'supply' | 'volume' | 'price'> = {
      id: collection.url,
      marketplace: NftMarketplace.solanart,
      name: collection.name,
      website: `https://solanart.io/collections/${collection.url}`,
      thumbnail: `https://data.solanart.io/img/collections/${collection.url}.webp`,
      symbol,
    };
    const volume = volumeByUrl[collection.url];
    if (volume) {
      const collectionPrice: NftCollectionPrice = {
        ...base,
        supply: volume.listedTotal || 0,
        price: volume.floorPrice || 0,
        volume: volume.totalVolume || 0,
      };

      return collectionPrice;
    } else {
      const price = await getSolanaPrice(collection);
      const collectionPrice: NftCollectionPrice = {
        ...base,
        supply: price.countTotal || 0,
        price: price.floorPrice || 0,
        volume: 0,
      };

      return collectionPrice;
    }
  });

  return await throttle(collectionPriceTasks, 100, 5);
};
