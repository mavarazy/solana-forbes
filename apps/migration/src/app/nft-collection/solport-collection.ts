import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { UpdateStream } from './update-stream';

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
  const res = await fetch(
    `https://lapi.solport.io/nft/collections?page=${page}`
  );
  if (!res.ok) {
    throw new Error('Failed to parse solPort');
  }
  const { max_page, collections } = (await res.json()) as SolPortRequest;
  if (page === max_page) {
    return agg.concat(collections);
  }
  return getCollectionsPage(agg.concat(collections), page + 1);
};

export const getSolPortCollections = async (
  updateStream: UpdateStream<NftCollectionPrice>
): Promise<void> => {
  const collections = await getCollectionsPage([]);
  collections.map((collection) => {
    const nftPrice: NftCollectionPrice = {
      id: `SOLPORT-${collection.id}`,
      marketplace: NftMarketplace.solport,
      name: collection.name,
      thumbnail: collection.cdn_featured_image,
      website: `https://solport.io/collection/${collection.route}`,
      price: collection.floor,
      volume: collection.volume,
      supply: collection.items,
    };
    updateStream.emit(nftPrice);
  });
};
