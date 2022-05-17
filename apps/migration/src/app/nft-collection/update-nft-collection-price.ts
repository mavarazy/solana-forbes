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
import { getDigitalEyesCollections } from './digitaleye-collection';
import { getExchagenArtCollections } from './exchange-art-collection';
import { getFractalCollections } from './fractal-collection';

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
    $price: numeric!
  ) {
    update_nft_collection_price_by_pk(
      pk_columns: { id: $id }
      _set: { price: $price, name: $name, symbol: $symbol, website: $website }
    ) {
      id
      name
      price
      source
      symbol
      website
    }
  }
`;

const InsertNftCollectionPriceQuery = gql`
  mutation InsertNftCollectionPrice(
    $id: String!
    $name: String
    $symbol: String
    $source: String!
    $website: String
    $price: numeric!
  ) {
    insert_nft_collection_price_one(
      object: {
        id: $id
        name: $name
        price: $price
        website: $website
        source: $source
        symbol: $symbol
      }
      on_conflict: {
        constraint: nft_collection_price_pkey
        update_columns: price
      }
    ) {
      id
      name
      price
      source
      website
    }
  }
`;

export const updateNftCollectionPrice = async () => {
  const {
    data: { nft_collection_price },
  } = await hasuraClient.query<GetNftCollectionIds>({
    query: GetNftCollectionIdsQuery,
  });

  const existingIds = new Set<string>(nft_collection_price.map(({ id }) => id));

  console.log('Getting collections');
  const exchangeArtCollections = await getExchagenArtCollections();
  const digitalEyesCollection = await getDigitalEyesCollections();
  const fractalCollections = await getFractalCollections();
  console.log('Extracted ', fractalCollections.length);

  const nftCollections: Array<NftCollectionPrice | null> = await throttle(
    fractalCollections
      .concat(exchangeArtCollections)
      .concat(digitalEyesCollection)
      .map((collection) => async () => {
        if (existingIds.has(collection.id)) {
          const {
            data: { update_nft_collection_price_by_pk },
          } = await hasuraClient.mutate<
            UpdateNftCollectionPrice,
            UpdateNftCollectionPriceVariables
          >({
            mutation: UpdateNftCollectionPriceQuery,
            variables: collection,
          });

          return update_nft_collection_price_by_pk;
        } else {
          try {
            const {
              data: { insert_nft_collection_price_one },
            } = await hasuraClient.mutate<
              InsertNftCollectionPrice,
              InsertNftCollectionPriceVariables
            >({
              mutation: InsertNftCollectionPriceQuery,
              variables: collection,
            });
            return insert_nft_collection_price_one;
          } catch (err) {
            console.log(err);
          }
        }
        return null;
      }),
    1000,
    10
  );

  const savedNftCollections = nftCollections.filter(
    (nft): nft is NftCollectionPrice => nft !== null
  );

  console.log('Saved ', savedNftCollections.length);

  return nftCollections;
};
