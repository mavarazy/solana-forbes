import { gql } from '@apollo/client';
import {
  GetNftCollectionIds,
  InsertNftCollectionPrice,
  InsertNftCollectionPriceVariables,
  NftCollectionPrice,
  UpdateNftCollectionPrice,
  UpdateNftCollectionPriceVariables,
} from '@forbex-nxr/types';
import { hasuraClient } from '@forbex-nxr/utils';
import { EventEmitter } from 'stream';
import { getAlphArtCollections } from './alpha-art-collection';
import { getDigitalEyesCollections } from './digitaleye-collection';
import { getExchagenArtCollections } from './exchange-art-collection';
import { getFractalCollections } from './fractal-collection';
import { getMagicEdenPrices } from './magic-eden-collection';
import { getSolanaArtCollections } from './solana-art-collection';
import { getSolSeaCollections } from './solsea-collection';
import { UpdateStream } from './update-stream';

const GetNftCollectionIdsQuery = gql`
  query GetNftCollectionIds {
    nft_collection_price {
      id
    }
  }
`;

const UpdateNftCollectionPriceQuery = gql`
  mutation UpdateNftCollectionPrice(
    $id: String!
    $name: String
    $symbol: String
    $website: String
    $thumbnail: String
    $price: numeric!
    $parent: String
    $volume: numeric
    $supply: numeric
  ) {
    update_nft_collection_price_by_pk(
      pk_columns: { id: $id }
      _set: {
        price: $price
        name: $name
        symbol: $symbol
        website: $website
        thumbnail: $thumbnail
        parent: $parent
        volume: $volume
        supply: $supply
      }
    ) {
      id
      name
      price
      marketplace
      symbol
      website
      thumbnail
      volume
      supply
    }
  }
`;

const InsertNftCollectionPriceQuery = gql`
  mutation InsertNftCollectionPrice(
    $id: String!
    $name: String
    $symbol: String
    $marketplace: nft_marketplace_enum!
    $website: String
    $thumbnail: String
    $parent: String
    $price: numeric!
    $volume: numeric
    $supply: numeric
  ) {
    insert_nft_collection_price_one(
      object: {
        id: $id
        name: $name
        price: $price
        website: $website
        marketplace: $marketplace
        symbol: $symbol
        thumbnail: $thumbnail
        parent: $parent
        volume: $volume
        supply: $supply
      }
      on_conflict: {
        constraint: nft_collection_price_pkey
        update_columns: price
      }
    ) {
      id
      name
      price
      marketplace
      website
      thumbnail
      volume
      supply
    }
  }
`;

const UpdateStream = new EventEmitter();

export const updateNftCollectionPrice = async () => {
  const {
    data: { nft_collection_price },
  } = await hasuraClient.query<GetNftCollectionIds>({
    query: GetNftCollectionIdsQuery,
  });

  const existingIds = new Set<string>(nft_collection_price.map(({ id }) => id));

  UpdateStream.on('nft', async (collectionPrice: NftCollectionPrice) => {
    try {
      if (existingIds.has(collectionPrice.id)) {
        const {
          data: { update_nft_collection_price_by_pk },
        } = await hasuraClient.mutate<
          UpdateNftCollectionPrice,
          UpdateNftCollectionPriceVariables
        >({
          mutation: UpdateNftCollectionPriceQuery,
          variables: collectionPrice,
        });

        return update_nft_collection_price_by_pk;
      } else {
        const {
          data: { insert_nft_collection_price_one },
        } = await hasuraClient.mutate<
          InsertNftCollectionPrice,
          InsertNftCollectionPriceVariables
        >({
          mutation: InsertNftCollectionPriceQuery,
          variables: collectionPrice,
        });
        return insert_nft_collection_price_one;
      }
    } catch (err) {
      console.log('Failed to save ', JSON.stringify(collectionPrice));
      console.log(err);
    }
  });

  const updateStream: UpdateStream<NftCollectionPrice> = {
    emit: (value: NftCollectionPrice) => UpdateStream.emit('nft', value),
  };

  await Promise.all([
    getMagicEdenPrices(updateStream),
    getFractalCollections(updateStream),
    getAlphArtCollections(updateStream),
    getDigitalEyesCollections(updateStream),
    getExchagenArtCollections(updateStream),
    getSolanaArtCollections(updateStream),
    getSolSeaCollections(updateStream),
  ]);
};
