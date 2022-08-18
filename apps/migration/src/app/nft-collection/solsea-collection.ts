import { NftCollectionPrice, NftMarketplace } from '@solana-forbes/types';
import { asUrl } from '@solana-forbes/utils';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import * as WebSocket from 'ws';

const log = console.log;

interface SolSeaCollection {
  _id: string;
  traits: [];
  creators: string[];
  subcategory: string[];
  tags: string[];
  nftCount: number;
  views: number;
  totalCount: number;
  listingDisabled: boolean;
  status: string;
  description: string;
  shortDescription: string;
  minted: true;
  visible: true;
  verified: true;
  title: string;
  twitter: string;
  discord: string;
  telegram: string;
  instagram: string;
  website: string;
  symbol: string;
  standard: string;
  supply: null | number;
  initialPrice: null | number;
  reported: null;
  nsfw: boolean;
  floorPrice: number;
  exhibitionId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  headerImage: string;
  iconImage: {
    _id: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: string;
    createdAt: number;
    updatedAt: number;
    __v: number;
    s3: {
      thumbnail: string;
      preview: string;
    };
  };
  volume: number;
}

interface SolSeaResponse {
  total: number;
  limit: number;
  skip: number;
  data: SolSeaCollection[];
}

const getAllSolSeaCollections = async (): Promise<SolSeaCollection[]> =>
  new Promise((resolve) => {
    const agg: SolSeaCollection[] = [];

    const socket = new WebSocket(
      'wss://api.all.art/socket.io/?EIO=3&transport=websocket'
    );

    const fetchCollections = (offset: number) => {
      log('Sending request with offset %o', offset);
      socket.send(
        `4224["find","collections",{"visible":true,"$limit":50,"$skip":${offset},"$sort":{"createdAt":-1},"verified":true,"$populate":["iconImage"]}]`
      );
    };

    socket.on('message', (data) => {
      const str = data.toLocaleString();
      if (str.startsWith('4324')) {
        const { total, limit, skip, data } = JSON.parse(
          str.substring(10, str.length - 1)
        ) as SolSeaResponse;
        agg.push(...data);
        const offset = skip + limit;
        if (offset >= total) {
          log('Offset is bigger, than total %o >= %o', offset, total);
          resolve(agg);
        } else {
          log('Fetch more %o', offset);
          fetchCollections(offset);
        }
      }
    });

    socket.on('open', function open() {
      log('Opened');
      fetchCollections(0);
    });
  });

const asPrice = (collection: SolSeaCollection): NftCollectionPrice => {
  const marketplaceUrl = `https://solsea.io/collection/${collection._id}`;

  const web = asUrl(collection.website || marketplaceUrl);
  return {
    id: collection._id,
    price: collection.floorPrice / LAMPORTS_PER_SOL || 0,
    web,
    marketplace: NftMarketplace.solsea,
    marketplaceUrl: marketplaceUrl,
    volume: collection.volume || 0,
    supply: collection.nftCount,

    collection: {
      web,
      name: collection.title,
      symbol: collection.symbol,
      description: collection.description,
      thumbnail: `https://content.solsea.io/${collection.iconImage?.s3.thumbnail}`,
      social: {
        web,
        telegram: collection.telegram,
        twitter: collection.twitter,
        discord: collection.discord,
        instagram: collection.instagram,
      },
    },
  };
};

export const getSolSeaCollections = async (): Promise<NftCollectionPrice[]> => {
  const collections = await getAllSolSeaCollections();
  log('Extracted ', collections.length);
  return collections.map(asPrice);
};
