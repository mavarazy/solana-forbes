import { NftCollectionPrice, NftMarketplace } from '@solana-forbes/types';
import axios from 'axios';
import { trackNftError } from './track-nft-collection-errors';

interface SolPortPriceChange {
  perc: number;
  start: number;
  end: number;
}

interface SolPortTag {
  id: number;
  text: string;
}

interface SolPortCollection {
  Tags: SolPortTag[];
  cdn_cover: string;
  cdn_featured_cover: null | string;
  cdn_featured_image: null | string;
  cdn_image: string;
  cover: string;
  createdAt: string;
  derivative_collection_id: null | string;
  description: string;
  discord: string;
  featured: number;
  floor: number;
  hidden: number;
  id: number;
  image: string;
  img_resize: number;
  items: number;
  name: string;
  price_change_7d: SolPortPriceChange;
  price_change_24h: SolPortPriceChange;
  route: string;
  rugged: number;
  twitter: string;
  updatedAt: string;
  volume: number;
}

interface SolPortRequest {
  collections: SolPortCollection[];
  max_page: number;
  page: string;
}

const getCollectionsPage = async (
  agg: SolPortCollection[],
  page = 1
): Promise<SolPortCollection[]> => {
  console.log('Requesting ', page);
  try {
    const {
      data: { max_page, collections },
    } = await axios.get<SolPortRequest>(
      `https://lapi.solport.io/nft/collections?page=${page}`
    );
    if (page === max_page) {
      return agg.concat(collections);
    }
    return getCollectionsPage(agg.concat(collections), page + 1);
  } catch (err) {
    trackNftError(err, NftMarketplace.solport, 'getCollectionsPage', {
      page,
    });
    return agg;
  }
};

export const getSolPortCollections = async (): Promise<
  NftCollectionPrice[]
> => {
  const collections = await getCollectionsPage([]);
  console.log('Extracted ', collections.length);
  return collections.map<NftCollectionPrice>((collection) => {
    const web = `https://solport.io/collection/${collection.route}`;
    return {
      id: `SOLPORT-${collection.id}`,
      marketplace: NftMarketplace.solport,
      marketplaceUrl: web,
      web,
      price: collection.floor,
      volume: collection.volume,
      supply: collection.items,
      collection: {
        web,
        name: collection.name,
        description: collection.description,
        thumbnail: collection.cdn_image,
        social: {
          web,
          discord: collection.discord,
          twitter: collection.twitter,
        },
      },
    };
  });
};
