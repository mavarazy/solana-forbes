import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { UpdateStream } from './update-stream';

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

const getFractalStats = async (id: string) => {
  const url = `https://api.fractal.is/admin/v1/collection/stats?collectionId=${id}`;
  const statsRes = await fetch(url);
  if (!statsRes.ok) {
    console.error(`Failed to fetch ${id} ${url}`);
    return null;
  }

  const projectStats = (await statsRes.json()) as FracatalStats;
  return projectStats;
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
  const managedRes = await fetch(
    `https://api.fractal.is/admin/v1/project/manage/${collection.id}/collection/manage`
  );

  if (!managedRes.ok) {
    return [];
  }
  const { collections } = (await managedRes.json()) as {
    collections: FractalManagedCollection[];
  };

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

  return prices.filter((price): price is NftCollectionPrice => price !== null);
};

export const getFractalCollections = async (
  updateStream: UpdateStream<NftCollectionPrice>
): Promise<NftCollectionPrice[]> => {
  const collectionRes = await fetch(
    'https://api.fractal.is/admin/v1/project/manage'
  );
  if (!collectionRes.ok) {
    throw new Error('Failed to fetch collections');
  }

  const { projects } =
    (await collectionRes.json()) as FractalCollectionResponse;

  const allPrices = (await Promise.all(projects.map(getAllCollections))).reduce(
    (agg: Promise<NftCollectionPrice>[], prices) =>
      agg.concat(prices.map(updateStream.update)),
    []
  );

  console.log('Fractal got ', allPrices.length);

  return Promise.all(allPrices);
};
