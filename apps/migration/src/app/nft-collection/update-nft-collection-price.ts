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
import { getAlphArtCollections } from './alpha-art-collection';
import { getDigitalEyesCollections } from './digitaleye-collection';
import { getExchagenArtCollections } from './exchange-art-collection';
import { getFractalCollections } from './fractal-collection';
import { getMagicEdenCollections } from './magic-eden-collection';
import { getSolanaArtCollections } from './solana-art-collection';
import { getSolSeaCollections } from './solsea-collection';

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
      }
    ) {
      id
      name
      price
      source
      symbol
      website
      thumbnail
    }
  }
`;

const InsertNftCollectionPriceQuery = gql`
  mutation InsertNftCollectionPrice(
    $id: String!
    $name: String
    $symbol: String
    $source: nft_marketplace_enum!
    $website: String
    $thumbnail: String
    $parent: String
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
        thumbnail: $thumbnail
        parent: $parent
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
      thumbnail
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
  const collections = await Promise.all([
    // getSolSeaCollections(),
    // getMagicEdenCollections(),
    // getExchagenArtCollections(),
    // getDigitalEyesCollections(),
    getFractalCollections(),
    // getAlphArtCollections(),
    // getSolanaArtCollections(),
  ]);

  const totalCollections = collections
    .reduce((agg, collections) => agg.concat(collections), [])
    .filter((nftPrice) => nftPrice.id && nftPrice.price);

  console.log('Extracted ', totalCollections.length);
  console.log(
    'Out of which with avatars ',
    totalCollections.filter((collection) => collection.thumbnail).length
  );

  const nftCollections: Array<NftCollectionPrice | null> = await throttle(
    totalCollections.map((collection) => async () => {
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
