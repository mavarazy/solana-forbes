import { gql } from '@apollo/client';
import {
  GetNftCollectionWorthByNames,
  NftCollectionPrice,
} from '@forbex-nxr/types';
import { hasuraClient } from './hasura-client';

const GetNftCollectionWorthByNamesQuery = gql`
  query GetNftCollectionWorthByNames($names: [String!]) {
    nft_collection_price(
      where: { _or: [{ name: { _in: $names } }, { symbol: { _in: $names } }] }
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

const getFloorPrice = async (
  names: string[]
): Promise<NftCollectionPrice | null> => {
  const {
    data: { nft_collection_price },
  } = await hasuraClient.query<GetNftCollectionWorthByNames>({
    query: GetNftCollectionWorthByNamesQuery,
    variables: { names },
  });

  if (nft_collection_price.length > 1) {
    console.log(`More than 1 nft matched to collection ${names.join(' | ')}`);
  }

  return nft_collection_price.length > 0 ? nft_collection_price[0] : null;
};

export const NftCollectionWorthService = {
  getFloorPrice,
};
