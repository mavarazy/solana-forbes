import { gql } from '@apollo/client';
import {
  GetNftCollectionIds,
  InsertNftCollectionPrice,
  InsertNftCollectionPriceChange,
  InsertNftCollectionPriceChangeVariables,
  InsertNftCollectionPriceVariables,
  NftCollectionPrice,
  NftCollectionPriceChange,
  UpdateNftCollectionPrice,
  UpdateNftCollectionPriceVariables,
} from '@forbex-nxr/types';
import { hasuraClient } from '@forbex-nxr/utils';
import { format } from 'date-fns';
import { randomUUID } from 'crypto';
import { getAlphArtCollections } from './alpha-art-collection';
import { getDigitalEyesCollections } from './digitaleye-collection';
import { getExchagenArtCollections } from './exchange-art-collection';
import { getFractalCollections } from './fractal-collection';
import { getMagicEdenPrices } from './magic-eden-collection';
import { getSolanaArtCollections } from './solana-art-collection';
import { getSolPortCollections } from './solport-collection';
import { getSolSeaCollections } from './solsea-collection';
import { UpdateStream } from './update-stream';

const GetNftCollectionIdsQuery = gql`
  query GetNftCollectionIds {
    nft_collection_price {
      id
    }
  }
`;

const InsertNftCollectionPriceChangeQuery = gql`
  mutation InsertNftCollectionPriceChange(
    $change: nft_collection_price_change_insert_input = {}
  ) {
    insert_nft_collection_price_change_one(object: $change) {
      id
      marketplace
      price
      volume
      date
      collection
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

const trackPriceChange = async (collectionPrice: NftCollectionPrice) => {
  try {
    const priceChange: Omit<NftCollectionPriceChange, 'id'> = {
      price: collectionPrice.price,
      volume: collectionPrice.volume,
      marketplace: collectionPrice.marketplace,
      date: format(Date.now(), 'MM/dd/yyyy'),
      collection: collectionPrice.id,
    };

    await hasuraClient.mutate<
      InsertNftCollectionPriceChange,
      InsertNftCollectionPriceChangeVariables
    >({
      mutation: InsertNftCollectionPriceChangeQuery,
      variables: {
        change: {
          id: randomUUID(),
          ...priceChange,
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
};

export const updateNftCollectionPrice = async () => {
  const {
    data: { nft_collection_price },
  } = await hasuraClient.query<GetNftCollectionIds>({
    query: GetNftCollectionIdsQuery,
  });

  const existingIds = new Set<string>(nft_collection_price.map(({ id }) => id));

  const updateStream: UpdateStream<NftCollectionPrice> = {
    update: async (collectionPrice: NftCollectionPrice) => {
      await trackPriceChange(collectionPrice);
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
      return collectionPrice;
    },
  };

  await Promise.all([
    getMagicEdenPrices(updateStream),
    getFractalCollections(updateStream),
    getAlphArtCollections(updateStream),
    getDigitalEyesCollections(updateStream),
    getExchagenArtCollections(updateStream),
    getSolanaArtCollections(updateStream),
    getSolSeaCollections(updateStream),
    getSolPortCollections(updateStream),
  ]);
};
