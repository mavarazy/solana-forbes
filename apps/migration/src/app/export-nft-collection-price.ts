import { gql } from '@apollo/client';
import { GetNftCollectionPrice, NftCollectionPrice } from '@forbex-nxr/types';
import { hasuraClient } from '@forbex-nxr/utils';
import { writeFile } from 'fs/promises';

const GetNftCollectionPriceQuery = gql`
  query GetNftCollectionPrice {
    nft_collection_price {
      id
      name
      price
      marketplace
      symbol
    }
  }
`;

export const exportNftCollectionPrice = async () => {
  const {
    data: { nft_collection_price },
  } = await hasuraClient.query<GetNftCollectionPrice>({
    query: GetNftCollectionPriceQuery,
  });

  await writeFile(
    './libs/utils/src/lib/nft-collection-price-map.ts',
    'export const Prices = ' +
      JSON.stringify(
        nft_collection_price.map((price) => {
          const nftPrice: Partial<NftCollectionPrice> = {
            price: price.price,
            marketplace: price.marketplace,
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
