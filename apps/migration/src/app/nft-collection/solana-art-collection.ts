import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { throttle } from '@forbex-nxr/utils';
import fetch from 'node-fetch';
import { Metaplex } from '@metaplex-foundation/js-next';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { UpdateStream } from './update-stream';

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
  const res = await fetch(
    `https://api.solanart.io/get_nft?collection=${url}&page=0&limit=1&order=price-ASC&min=0&max=99999&search=&listed=true&fits=all`
  );
  if (!res.ok) {
    console.log('Failed to fetch data for ', url);
    return null;
  }

  const items = (await res.json()).items as SolanaArtListedItem[];
  if (items.length === 0) {
    return null;
  }

  try {
    const tokenAddr = items[0].token_add;
    const nft = await metaplex.nfts().findByMint(new PublicKey(tokenAddr));

    return nft.symbol;
  } catch (err) {
    console.log('Failed to fetch NFT info for ', items[0].token_add);
  }
  return null;
};

const getSolanaPrice = async (
  collection: SolanaArtCollection
): Promise<SolanaArtPrice> => {
  const res = await fetch(
    `https://api.solanart.io/get_floor_price?collection=${collection.url}`
  );
  if (res.ok) {
    return (await res.json()) as SolanaArtPrice;
  }
  console.log(
    'Failed to get a price for ',
    collection.url,
    ' ',
    collection.name
  );
  return null;
};

const getAllSolanaArtCollections = async (): Promise<SolanaArtCollection[]> => {
  try {
    console.log('Sending request');
    const res = await fetch('https://api.solanart.io/get_collections');
    console.log('Got reponse');
    const collections = (await res.json()) as SolanaArtCollection[];
    console.log('Fetched collection for ', collections.length);
    return collections;
  } catch (err) {
    console.log(err);
  }
  return [];
};

const getAllSolanaArtVolume = async (): Promise<SolanaArtVolume[]> => {
  try {
    console.log('Sending request');
    const res = await fetch('https://api.solanart.io/query_volume_all');
    console.log('Got reponse');
    const collections = (await res.json()) as SolanaArtVolume[];
    console.log('Fetched collection for ', collections.length);
    return collections;
  } catch (err) {
    console.log(err);
  }
  return [];
};

export const getSolanaArtCollections = async (
  updateStream: UpdateStream<NftCollectionPrice>
): Promise<void> => {
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
        supply: volume.listedTotal,
        price: volume.floorPrice,
        volume: volume.totalVolume,
      };

      await updateStream.update(collectionPrice);
    } else {
      const price = await getSolanaPrice(collection);
      const collectionPrice: NftCollectionPrice = {
        ...base,
        supply: price.countTotal,
        price: price.floorPrice,
        volume: 0,
      };

      await updateStream.update(collectionPrice);
    }
  });

  await throttle(collectionPriceTasks, 100, 5);
};
