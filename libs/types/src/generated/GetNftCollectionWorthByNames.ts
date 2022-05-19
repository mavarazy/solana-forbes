/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetNftCollectionWorthByNames
// ====================================================

export interface GetNftCollectionWorthByNames_nft_collection_price {
  id: string;
  name: string;
  price: general.numeric;
  source: general.NftCollectionSource;
  symbol: string | null;
  website: string | null;
}

export interface GetNftCollectionWorthByNames {
  /**
   * fetch data from the table: "nft_collection_price"
   */
  nft_collection_price: GetNftCollectionWorthByNames_nft_collection_price[];
}

export interface GetNftCollectionWorthByNamesVariables {
  names?: string[] | null;
}
