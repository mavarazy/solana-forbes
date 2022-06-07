import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';

interface FractalCollection {
  description: string;
  id: string;
  studio: string;
  title: string;
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

interface FractalCollectionResponse {
  projects: FractalCollection[];
}

interface FracatalCollectionInfo {
  description: string;
  expectedTotalTokens: number;
  id: string;
  productId: string;
  rank: number;
  title: string;
  visible: boolean;
}

interface FracatalStats {
  floorPrice: number;
  totalSalesVolume: number;
  numSales: number;
  totalListed: number;
}

interface FractalStatsResponse {
  collections: Array<{
    collection: FracatalCollectionInfo;
    collectionStats: FracatalStats;
  }>;
  projectStats: FracatalStats;
}

const getCollectionStats = async (
  collection: FractalCollection
): Promise<NftCollectionPrice | null> => {
  const url = `https://api.fractal.is/admin/v1/project/${collection.id}/stats`;
  const statsRes = await fetch(url);
  if (!statsRes.ok) {
    console.error(`Failed to fetch ${collection.id}`);
    return null;
  }

  const { projectStats } = (await statsRes.json()) as FractalStatsResponse;

  return {
    id: collection.id,
    source: NftMarketplace.fractal,
    name: collection.title,
    thumbnail: collection.avatar.url,
    website: collection.social?.web,
    price: projectStats.floorPrice,
  };
};

export const getFractalCollections = async (): Promise<
  NftCollectionPrice[]
> => {
  const collectionRes = await fetch(
    'https://api.fractal.is/admin/v1/project/manage'
  );
  if (!collectionRes.ok) {
    throw new Error('Failed to fetch collections');
  }

  const { projects } =
    (await collectionRes.json()) as FractalCollectionResponse;

  const prices = (await Promise.all(projects.map(getCollectionStats))).filter(
    (col): col is NftCollectionPrice => col !== null
  );

  console.log('Fractal got ', prices.length);

  return prices;
};
