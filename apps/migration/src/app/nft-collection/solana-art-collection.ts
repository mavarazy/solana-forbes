import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { throttle } from '@forbex-nxr/utils';
import fetch from 'node-fetch';
import { Metaplex } from '@metaplex-foundation/js-next';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';

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

interface SolanaArtPriceResponse {
  api_version: string;
  result: {
    api_code: number;
    api_response: string;
    data: SolanaArtCollectionPrice[];
  };
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

const getAllSolanaArtPrices = async (): Promise<SolanaArtCollectionPrice[]> => {
  try {
    console.log('Sending request');
    const res = await fetch('https://api.solanart.io/howrare/collections');
    console.log('Got reponse');
    if (!res.ok) {
      throw new Error('Failed to fetch the result');
    }
    const {
      result: { data: prices },
    } = (await res.json()) as SolanaArtPriceResponse;
    console.log('Fetched prices for ', prices.length);
    return prices;
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
      const symbol = await getCollectionSymbol(collection.url);
      if (price) {
        return {
          id: collection.url,
          marketplace: NftMarketplace.solanart,
          name: collection.name,
          website: collection.website,
          price: price.floorPrice,
          thumbnail: `https://data.solanart.io/img/collections/${collection.url}.webp`,
          symbol,
          supply: price.countTotal,
          volume: price.countTotal * price.floorPrice,
        };
      }
      return null;
    }
  );

  const collectionPrices = await throttle(collectionPriceTasks, 100, 5);
  const pricesWithSymbol = await throttle(
    prices.map((price) => async (): Promise<NftCollectionPrice> => {
      const symbol = await getCollectionSymbol(price.url.substring(1));
      return {
        id: price.url,
        marketplace: NftMarketplace.solanart,
        name: price.name,
        symbol,
        price: parseFloat(price.floor),
        thumbnail: `https://data.solanart.io/img/collections/${price.url}.webp`,
        volume: price.floor_marketcap,
        supply: price.items,
      };
    }),
    100,
    5
  );

  const nftPrices: NftCollectionPrice[] = pricesWithSymbol.concat(
    collectionPrices.filter(
      (price): price is NftCollectionPrice => price !== null
    )
  );

  return nftPrices;
};
