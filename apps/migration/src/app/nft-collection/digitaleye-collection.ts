import { NftCollectionPrice, NftMarketplace } from '@solana-forbes/types';
import { throttle } from '@solana-forbes/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';
import { trackNftError } from './track-nft-collection-errors';

interface DigitalEyeCollection {
  '24h_sales': number;
  collectionId: string;
  description: string;
  disputedMessage: string;
  isCurated: boolean;
  isDerivative: boolean;
  isNsfw: boolean;
  name: string;
  publishedEpoch: number;
  thumbnail: string;
  verifeyed: boolean;
  volumeLastUpdatedAt: string;
  volumePast7days: number;
  volumePast24h: number;
  volumeTotal: number;
  website: string;
}

interface DigitalEyeOffer {
  count: number;
  next_cursor: string | null;
  price_floor: bigint;
}

const getCollectionPrice = async (
  collection: string
): Promise<number | null> => {
  const url = `https://us-central1-digitaleyes-prod.cloudfunctions.net/offers-retriever?collection=${encodeURIComponent(
    collection
  )}&price=asc`;
  try {
    console.log('Checking collection', collection);
    const { data: offer } = await axios.get<DigitalEyeOffer>(url);
    console.log('Got an offer for ', collection, ' ', offer.price_floor);

    return Number(offer.price_floor) / LAMPORTS_PER_SOL;
  } catch (err) {
    if (err?.response?.status !== 500) {
      trackNftError(err, NftMarketplace.digitaleyes, 'getCollectionPrice', {
        collection,
        url,
      });
    }
  }
  return null;
};

const getCollections = async (): Promise<DigitalEyeCollection[]> => {
  try {
    console.log('Sending request');
    const res = await axios.get<DigitalEyeCollection[]>(
      'https://us-central1-digitaleyes-prod.cloudfunctions.net/collection-retriever'
    );
    console.log('Fetched ', res.data.length);
    return res.data;
  } catch (err) {
    trackNftError(err, NftMarketplace.digitaleyes, 'getCollections', {});
  }
  return [];
};

const parseThumbnail = (thumbnail?: string) => {
  if (!thumbnail) {
    return null;
  }
  if (thumbnail.startsWith('thumbnail')) {
    return `https://ik.imagekit.io/srjnqnjbpn9/${thumbnail}?ik-sdk-version=react-1.0.11`;
  }
  return thumbnail;
};

export const getDigitalEyesCollections = async (): Promise<
  NftCollectionPrice[]
> => {
  console.log('Getting collections');
  const collections = await getCollections();
  console.log('Processing ', collections.length);

  const collection = await throttle(
    collections.map(
      (collection) => async (): Promise<NftCollectionPrice | null> => {
        const floorPrice = await getCollectionPrice(collection.name);
        const slug = collection.name.replace(/\s/g, '-');

        const makretplaceUrl = `https://digitaleyes.market/collections/${slug}`;
        const web = collection.website || makretplaceUrl;

        return {
          id: collection.collectionId,
          web,
          marketplace: NftMarketplace.digitaleyes,
          marketplaceUrl: `https://digitaleyes.market/collections/${slug}`,
          price: floorPrice || 0,
          volume: collection.volumeTotal / LAMPORTS_PER_SOL || 0,
          supply: 0,
          collection: {
            web,
            name: collection.name,
            thumbnail: parseThumbnail(collection.thumbnail),
            social: {
              web,
            },
          },
        };
      }
    ),
    1000,
    25
  );

  return collection.filter((nft): nft is NftCollectionPrice => nft !== null);
};
