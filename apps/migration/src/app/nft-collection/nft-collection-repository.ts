import { gql } from '@apollo/client';
import {
  GetNftCollectionIds,
  InsertNftCollectionPrice,
  InsertNftCollectionPriceVariables,
  NftCollectionPrice,
  UpdateNftCollectionPrice,
  UpdateNftCollectionPriceVariables,
} from '@forbex-nxr/types';
import { hasuraClient, throttle } from '@forbex-nxr/utils';
import { format } from 'date-fns';

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
    $marketplace: nft_marketplace_enum!
    $price: numeric!
    $parent: String
    $volume: numeric
    $supply: numeric
    $date: date!
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

    insert_nft_collection_price_change_one(
      object: {
        collection: $id
        date: $date
        marketplace: $marketplace
        price: $price
        volume: $volume
      }
    ) {
      id
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
    $date: date!
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

    insert_nft_collection_price_change_one(
      object: {
        collection: $id
        date: $date
        marketplace: $marketplace
        price: $price
        volume: $volume
      }
    ) {
      id
    }
  }
`;

const existingIdsPromise: Promise<Set<string>> = (async () => {
  const {
    data: { nft_collection_price },
  } = await hasuraClient.query<GetNftCollectionIds>({
    query: GetNftCollectionIdsQuery,
  });

  const existingIds = new Set<string>(nft_collection_price.map(({ id }) => id));

  return existingIds;
})();

const update = async (collectionPrice: NftCollectionPrice) => {
  try {
    const existingIds = await existingIdsPromise;
    if (existingIds.has(collectionPrice.id)) {
      const {
        data: { update_nft_collection_price_by_pk },
      } = await hasuraClient.mutate<
        UpdateNftCollectionPrice,
        UpdateNftCollectionPriceVariables
      >({
        mutation: UpdateNftCollectionPriceQuery,
        variables: {
          ...collectionPrice,
          date: format(Date.now(), 'MM/dd/yyyy'),
        },
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
        variables: {
          ...collectionPrice,
          date: format(Date.now(), 'MM/dd/yyyy'),
        },
      });
      return insert_nft_collection_price_one;
    }
  } catch (err) {
    console.log('Failed to save ', JSON.stringify(collectionPrice));
    console.log(err);
  }
  return collectionPrice;
};

const updateInBatch = (
  prices: NftCollectionPrice[]
): Promise<NftCollectionPrice[]> =>
  throttle(
    prices.map((price) => async () => update(price)),
    10,
    10
  );

export const NftCollectionRepository = {
  update,
  updateInBatch,
};
