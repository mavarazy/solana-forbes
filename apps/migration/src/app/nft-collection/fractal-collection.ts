import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import axios from 'axios';
import { trackNftError } from './track-nft-collection-errors';

interface FractalCollection {
  id: string;
  title: string;
  description: string;
  studio: string;
  handle: string;
  avatar: {
    url: string;
    height: number;
    width: number;
  };
  social: {
    web?: string;
    twitter?: string;
    discord?: string;
  };
}

interface FractalManagedCollection {
  id: string;
  title: string;
  description: string;
  expectedTotalTokens: number;
  productId: string;
  rank: number;
  visible: true;
}

interface FractalCollectionResponse {
  projects: FractalCollection[];
}

interface FracatalStats {
  floorPrice: number;
  totalSalesVolume: number;
  numSales: number;
  totalListed: number;
}

const getFractalStats = async (id: string): Promise<FracatalStats | null> => {
  const url = `https://api.fractal.is/admin/v1/collection/stats?collectionId=${id}`;
  try {
    const { data: projectStats } = await axios.get<FracatalStats>(url);
    return projectStats;
  } catch (err) {
    trackNftError(NftMarketplace.fractal, 'getFractalStats', err, { id });
  }
  return null;
};

const getCollectionStats = async (
  collection: Pick<FractalCollection, 'id' | 'title' | 'avatar' | 'handle'> & {
    parent: string;
  }
): Promise<NftCollectionPrice | null> => {
  const stats = await getFractalStats(collection.id);

  if (!stats) {
    return null;
  }

  return {
    id: collection.id,
    marketplace: NftMarketplace.fractal,
    name: collection.title,
    thumbnail: collection.avatar.url,
    website: `https://www.fractal.is/${collection.handle}`,
    parent: collection.parent,
    price: stats.floorPrice,
    volume: stats.totalSalesVolume,
    supply: stats.totalListed,
  };
};

const getAllCollections = async (
  collection: FractalCollection
): Promise<NftCollectionPrice[]> => {
  try {
    const {
      data: { collections },
    } = await axios.get<{
      collections: FractalManagedCollection[];
    }>(
      `https://api.fractal.is/admin/v1/project/manage/${collection.id}/collection/manage`
    );

    const prices = await Promise.all(
      collections.map((managed) =>
        getCollectionStats({
          ...managed,
          avatar: collection.avatar,
          handle: collection.handle,
          parent: collection.title,
        })
      )
    );

    return prices.filter(
      (price): price is NftCollectionPrice => price !== null
    );
  } catch (err) {
    trackNftError(NftMarketplace.fractal, 'getAllCollections', err, {});
  }
  return [];
};

export const getFractalCollections = async (): Promise<
  NftCollectionPrice[]
> => {
  try {
    const {
      data: { projects },
    } = await axios.get<FractalCollectionResponse>(
      'https://api.fractal.is/admin/v1/project/manage'
    );

    const allPrices = (
      await Promise.all(projects.map(getAllCollections))
    ).reduce((agg: NftCollectionPrice[], prices) => agg.concat(prices), []);
    console.log('Fractal got ', allPrices.length);

    return Promise.all(allPrices);
  } catch (err) {
    console.error(err);
    return [];
  }
};
