/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetNftCollectionPrices
// ====================================================

export interface GetNftCollectionPrices_nft_collection_price {
  id: string;
  name: string;
  website: string | null;
  source: general.NftCollectionSource;
  symbol: string | null;
  price: general.numeric;
}

export interface GetNftCollectionPrices {
  /**
   * fetch data from the table: "nft_collection_price"
   */
  nft_collection_price: GetNftCollectionPrices_nft_collection_price[];
}
