import { gql } from '@apollo/client';
import { NftCollectionPrice } from '@forbex-nxr/types';
import { hasuraClient, throttle } from '@forbex-nxr/utils';
import { getDigitalEyesCollections } from './digitaleye-collection';
import { getExchagenArtCollections } from './exchange-art-collection';

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
      website
    }
  }
`;

export const updateNftCollectionPrice = async () => {
  console.log('Getting collections');
  const exchangeArtCollections = await getExchagenArtCollections();
  const digitalEyesCollection = await getDigitalEyesCollections();
  console.log('Extracted ', exchangeArtCollections.length);

  const nftCollections: Array<NftCollectionPrice | null> = await throttle(
    exchangeArtCollections
      .concat(digitalEyesCollection)
      .map((collection) => async () => {
        try {
          const {
            data: { insert_nft_collection_price_one },
          } = await hasuraClient.mutate({
            mutation: InsertNftCollectionPriceQuery,
            variables: collection,
          });
          return insert_nft_collection_price_one;
        } catch (err) {
          console.log(err);
        }
        return null;
      }),
    1000,
    50
  );

  const savedNftCollections = nftCollections.filter(
    (nft): nft is NftCollectionPrice => nft !== null
  );

  console.log('Saved ', savedNftCollections.length);

  return nftCollections;
};
