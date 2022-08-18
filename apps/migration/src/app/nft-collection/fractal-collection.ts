import {
  NftCollection,
  NftCollectionPrice,
  NftMarketplace,
} from '@solana-forbes/types';
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
    cover: string;
  };
  banner: {
    url: string;
    height: number;
    width: number;
    cover: string;
  };
  socials: {
    web?: string;
    twitter?: string;
    discord?: string;
  };
  about: {
    yearFounded: string;
    teamSize: string;
    title: string;
    description: string;
    footerImage: string;
  };
  approved: boolean;
  active: boolean;
  iframeUrl: string;
  proofOfJustin: string;
  fractalRadio: string;
  trailer: string;
  doxxed: boolean;
}

interface FractalManagedCollection {
  id: string;
  title: string;
  description: string;
  expectedTotalTokens: number;
  productId: string;
  rank: number;
  visible: boolean;
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
    if (err?.response?.status !== 404) {
      trackNftError(err, NftMarketplace.fractal, 'getFractalStats', { id });
    }
  }
  return null;
};

const getCollectionStats = async (
  fractalCollection: FractalCollection,
  fractalManagedCollection: FractalManagedCollection
): Promise<NftCollectionPrice | null> => {
  const stats = await getFractalStats(fractalManagedCollection.id);

  const handleUrl = encodeURIComponent(fractalCollection.handle);

  const marketplaceUrl = `https://www.fractal.is/${handleUrl}`;
  const web = fractalCollection.socials.web ?? marketplaceUrl;

  const collection: NftCollection = {
    web,
    name: fractalCollection.title,
    thumbnail: fractalCollection.avatar.url,
    social: {
      web,
      discord: fractalCollection.socials.discord,
      twitter: fractalCollection.socials.twitter,
    },
    parent: fractalCollection.title,
  };

  if (!stats) {
    return {
      id: fractalCollection.id,
      web,
      marketplace: NftMarketplace.fractal,
      marketplaceUrl,
      price: 0,
      volume: 0,
      supply: 0,
      collection,
    };
  }

  return {
    id: fractalCollection.id,
    web,
    marketplace: NftMarketplace.fractal,
    marketplaceUrl: marketplaceUrl,
    price: stats.floorPrice || 0,
    volume: stats.totalSalesVolume || 0,
    supply: stats.totalListed || 0,
    collection,
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
      collections.map((managed) => getCollectionStats(collection, managed))
    );

    return prices;
  } catch (err) {
    trackNftError(err, NftMarketplace.fractal, 'getAllCollections', {});
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
    trackNftError(err, NftMarketplace.fractal, 'getFractalCollections', {});
    return [];
  }
};
