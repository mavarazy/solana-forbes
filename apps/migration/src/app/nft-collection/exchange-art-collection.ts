import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { throttle } from '@forbex-nxr/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';
import { trackNftError } from './track-nft-collection-errors';

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
    const stats = (await axios.get<ExchangeArtStats[]>(url)).data;
    console.log('Retrieved stats of ', stats.length);
    return stats;
  } catch (err) {
    trackNftError(err, NftMarketplace.exchageart, 'getAllExchangeArtStats', {
      ids: ids.join(', '),
      url,
    });
  }

  return [];
};

const getAllExchangeArtCollections = async (): Promise<
  ExchangeArtCollection[]
> => {
  try {
    console.log('Sending request');
    const {
      data: { leaderboard },
    } = await axios.get<{ leaderboard: ExchangeArtCollection[] }>(
      'https://api.exchange.art/v2/sales/collections/leaderboard?offset=0&limit=10000&verbosity=1&period=365d&category='
    );
    console.log('Fetched ', leaderboard.length);
    return leaderboard;
  } catch (err) {
    trackNftError(
      err,
      NftMarketplace.exchageart,
      'getAllExchangeArtCollections',
      {}
    );
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

      const collectionPrice: NftCollectionPrice = {
        id: collection.id,
        name: collection.name,
        website: `https://exchange.art/series/${collection.name}`,
        price: (price.floorPrice || price.highestSale) / LAMPORTS_PER_SOL,
        thumbnail: collection.thumbnailPath
          ? `https://images-cdn.exchange.art/${collection.thumbnailPath}`
          : null,
        symbol: price.symbol,
        marketplace: NftMarketplace.exchageart,
        volume: price.totalVolume / LAMPORTS_PER_SOL,
        supply: 0,
      };

      agg.push(collectionPrice);

      return agg;
    },
    []
  );

  console.log(nftColl.length);

  return Promise.all(nftColl);
};
