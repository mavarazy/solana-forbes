import { gql } from '@apollo/client';
import { NftCollectionPrice } from '@forbex-nxr/types';
import { hasuraClient } from '@forbex-nxr/utils';
import { writeFile } from 'fs/promises';

const GetNftCollectionPriceQuery = gql`
  query GetNftCollectionPrice {
    nft_collection_price {
      id
      name
      price
      source
      symbol
    }
  }
`;

export const loadNftCollectionPrice = async () => {
  const {
    data: { nft_collection_price },
  } = await hasuraClient.query({
    query: GetNftCollectionPriceQuery,
  });

  await writeFile(
    './libs/utils/src/lib/nft-collection-price-map.ts',
    'export const Prices = ' +
      JSON.stringify(
        nft_collection_price.map((price) => {
          const nftPrice: Partial<NftCollectionPrice> = {
            price: price.price,
            source: price.source,
          };
          if (price.name) {
            nftPrice.name = price.name.toLowerCase().trim();
          }
          if (price.symbol && price.symbol !== price.name) {
            nftPrice.symbol = price.symbol.toLowerCase().trim();
          }
          return nftPrice;
        }),
        null,
        2
      )
  );
};
