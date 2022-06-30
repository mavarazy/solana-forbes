import { NftCollectionPrice, NftMarketplace } from '@forbex-nxr/types';
import { throttle } from '@forbex-nxr/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as Sentry from '@sentry/node';
import axios from 'axios';

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
  try {
    console.log('Checking collection', collection);
    const { data: offer } = await axios.get<DigitalEyeOffer>(
      `https://us-central1-digitaleyes-prod.cloudfunctions.net/offers-retriever?collection=${collection}&price=asc`
    );
    console.log('Got an offer for ', collection, ' ', offer.price_floor);

    return Number(offer.price_floor) / LAMPORTS_PER_SOL;
  } catch (err) {
    console.warn(
      `${err.status}:digitaeye.getCollectionPrice: Failed to get ${collection}`
    );
    Sentry.captureException(err, {
      extra: {
        action: 'getCollectionPrice',
        marketplace: NftMarketplace.digitaleyes,
        collection,
      },
    });
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
    console.warn(`${err.status}:DigitalEye.getCollections: Failed`);
    Sentry.captureException(err, {
      extra: {
        action: 'getCollections',
        marketplace: NftMarketplace.digitaleyes,
      },
    });
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
        if (floorPrice) {
          const slug = collection.name.replace(/\s/g, '-');
          const collectionPrice = {
            id: collection.collectionId,
            name: collection.name,
            website: `https://digitaleyes.market/collections/${slug}`,
            marketplace: NftMarketplace.digitaleyes,
            thumbnail: parseThumbnail(collection.thumbnail),
            price: floorPrice,
            volume: collection.volumeTotal / LAMPORTS_PER_SOL,
            supply: 0,
          };

          return collectionPrice;
        }
        return null;
      }
    ),
    1000,
    25
  );

  return collection.filter((nft): nft is NftCollectionPrice => nft !== null);
};
