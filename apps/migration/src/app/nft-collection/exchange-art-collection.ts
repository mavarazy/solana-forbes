import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { throttle } from '@forbex-nxr/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface ExchangeArtCollection {
  artists: string[];
  bannerPath: string;
  brand: { id: string; name: string };
  categories: string[];
  description: string;
  id: string;
  isCertified: boolean;
  isCurated: boolean;
  isNsfw: boolean;
  isOneOfOne: boolean;
  name: string;
  primaryCategory: string;
  secondaryCategory: string;
  tags: string[];
  tertiaryCategory: string;
  thumbnailPath: string;
  twitter: string;
  website: string;
}

interface ExchangeArtStats {
  floorPrice?: number;
  highestSale: number;
  symbol: string;
  totalTransactions: number;
  totalVolume: number;
}

const getAllExchangeArtStats = async (
  ids: string[]
): Promise<ExchangeArtStats[]> => {
  const collectionIds = ids.map((id) => `collectionIds=${id}`).join('&');
  const url = `https://api.exchange.art/v2/collections/sales/stats?period=30d&${collectionIds}`;
  console.log(`${ids[0]}: Fetching`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.log(text);
    }
    const stats: ExchangeArtStats[] = (await res.json()) as ExchangeArtStats[];
    console.log('Retrieved stats of ', stats.length);
    return stats;
  } catch (err) {
    console.log(`${ids[0]}: Error fetching `, err);
  }
  return [];
};

const getAllExchangeArtCollections = async (): Promise<
  ExchangeArtCollection[]
> => {
  try {
    console.log('Sending request');
    const res = await fetch(
      'https://api.exchange.art/v2/sales/collections/leaderboard?offset=0&limit=274&verbosity=1&period=7d&category='
    );
    console.log('Got reponse');
    const { leaderboard } = await res.json();
    console.log('Fetched ', leaderboard.length);
    return leaderboard;
  } catch (err) {
    console.log(err);
  }
  return [];
};

export const getExchagenArtCollections = async (): Promise<
  NftCollectionPrice[]
> => {
  console.log('Getting collections');
  const collections = await getAllExchangeArtCollections();
  const ids = collections.map(({ id }) => id);

  console.log('Processing ', collections.filter((c) => c.id).length);
  const prices = (
    await throttle(
      ids.map((id) => async () => {
        try {
          return getAllExchangeArtStats([id]);
        } catch (err) {
          return [];
        }
      }),
      1000,
      10
    )
  ).reduce((agg, price) => agg.concat(price), []);

  const priceToStats = prices.reduce(
    (agg: { [key in string]: ExchangeArtStats }, price) =>
      Object.assign(agg, { [price.symbol]: price }),
    {}
  );

  const nftColl: NftCollectionPrice[] = collections.reduce(
    (agg: NftCollectionPrice[], collection) => {
      const price = priceToStats[collection.name];
      if (!price || !price.floorPrice || !price.highestSale) {
        return agg;
      }

      const nft: NftCollectionPrice = {
        id: collection.id,
        name: collection.name,
        website: collection.website,
        price: (price.floorPrice || price.highestSale) / LAMPORTS_PER_SOL,
        thumbnail: collection.thumbnailPath
          ? `https://images-cdn.exchange.art/${collection.thumbnailPath}`
          : null,
        symbol: price.symbol,
        source: NftMarketplace.exchageart,
      };
      agg.push(nft);

      return agg;
    },
    []
  );

  console.log(nftColl.length);

  return nftColl;
};
