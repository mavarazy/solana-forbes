import { NftCollectionPrice } from '@forbex-nxr/types';
import { throttle } from '@forbex-nxr/utils';
import fetch from 'node-fetch';

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

interface SolanaArtCollectionPrice {
  floor: string;
  floor_marketcap: number;
  floor_marketcap_pretty: string;
  holders: number;
  items: number;
  logo: string;
  name: string;
  on_sale: number;
  url: string;
}

interface SolanaArtPrice {
  countTotal: number;
  count_listed: number;
  floorPrice: number;
}

interface SolanartPriceResponse {
  api_version: string;
  result: {
    api_code: number;
    api_response: string;
    data: SolanaArtCollectionPrice[];
  };
}

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

const getAllSolanaArtPrices = async (): Promise<NftCollectionPrice[]> => {
  try {
    console.log('Sending request');
    const res = await fetch('https://api.solanart.io/howrare/collections');
    console.log('Got reponse');
    if (!res.ok) {
      throw new Error('Failed to fetch the result');
    }
    const {
      result: { data: prices },
    } = (await res.json()) as SolanartPriceResponse;
    console.log('Fetched prices for ', prices.length);
    return prices.map((price) => ({
      id: price.url,
      source: 'solana-art',
      name: price.name,
      symbol: price.url,
      price: parseFloat(price.floor),
    }));
  } catch (err) {
    console.log(err);
  }
  return [];
};

export const getSolanaArtCollections = async (): Promise<
  NftCollectionPrice[]
> => {
  console.log('Getting collections');
  const collections = await getAllSolanaArtCollections();
  const prices = await getAllSolanaArtPrices();

  const collectionPriceTasks = collections.map(
    (collection) => async (): Promise<NftCollectionPrice | null> => {
      const price = await getSolanaPrice(collection);
      if (price) {
        return {
          id: collection.url,
          source: 'solana-art',
          name: collection.name,
          website: collection.website,
          price: price.floorPrice,
        };
      }
      return null;
    }
  );

  const collectionPrices = await throttle(collectionPriceTasks, 100, 1);

  const nftPrices: NftCollectionPrice[] = prices.concat(
    collectionPrices.filter(
      (price): price is NftCollectionPrice => price !== null
    )
  );

  return nftPrices;
};
