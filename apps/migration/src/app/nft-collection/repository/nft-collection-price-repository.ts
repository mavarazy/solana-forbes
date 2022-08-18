import { gql } from '@apollo/client';
import {
  GetNftCollectionPriceIds,
  InsertNftCollectionPrice,
  InsertNftCollectionPriceVariables,
  NftCollectionPrice,
  UpdateNftCollectionPrice,
  UpdateNftCollectionPriceVariables,
} from '@solana-forbes/types';
import { asUrl, hasuraClient, throttle } from '@solana-forbes/utils';
import * as Sentry from '@sentry/node';
import { format } from 'date-fns';

const GetNftCollectionPriceIdsQuery = gql`
  query GetNftCollectionPriceIds {
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
    $marketplaceUrl: String
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
        marketplaceUrl: $marketplaceUrl
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
      marketplaceUrl
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
    $marketplaceUrl: String
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
        marketplaceUrl: $marketplaceUrl
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
      marketplaceUrl
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

const normalize = (
  collectionPrice: NftCollectionPrice
): NftCollectionPrice => ({
  ...collectionPrice,
  marketplaceUrl: asUrl(collectionPrice.marketplaceUrl),
  web: asUrl(collectionPrice.web),
});

const existingIdsPromise: Promise<Set<string>> = (async () => {
  const {
    data: { nft_collection_price },
  } = await hasuraClient.query<GetNftCollectionPriceIds>({
    query: GetNftCollectionPriceIdsQuery,
  });

  const existingIds = new Set<string>(nft_collection_price.map(({ id }) => id));

  return existingIds;
})();

const doUpdate = async (
  collectionPrice: NftCollectionPrice
): Promise<NftCollectionPrice> => {
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

const update = async (
  price: NftCollectionPrice
): Promise<NftCollectionPrice> => {
  return doUpdate(normalize(price));
};

const updateInBatch = async (
  prices: NftCollectionPrice[]
): Promise<NftCollectionPrice[]> => {
  const collectionPrices = await throttle<NftCollectionPrice | null>(
    prices.map(normalize).map((price) => async () => {
      try {
        return doUpdate(normalize(price));
      } catch (err) {
        console.warn(`Failed to save ${price}`);
        Sentry.captureException(err, {
          extra: {
            price,
          },
        });
      }
      return null;
    }),
    1000,
    5
  );

  return collectionPrices.filter((price) => price !== null);
};

export const NftCollectionPriceRepository = {
  update,
  updateInBatch,
};
