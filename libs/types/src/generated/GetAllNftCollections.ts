/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetAllNftCollections
// ====================================================

export interface GetAllNftCollections_nft_collection_price {
  id: string;
  name: string;
  parent: string | null;
  supply: general.numeric | null;
  symbol: string | null;
  thumbnail: string | null;
  website: string | null;
}

export interface GetAllNftCollections {
  /**
   * fetch data from the table: "nft_collection_price"
   */
  nft_collection_price: GetAllNftCollections_nft_collection_price[];
}
