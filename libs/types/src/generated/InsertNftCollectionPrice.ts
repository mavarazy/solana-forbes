/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL mutation operation: InsertNftCollectionPrice
// ====================================================

export interface InsertNftCollectionPrice_insert_nft_collection_price_one {
  id: string;
  name: string;
  price: general.numeric;
  source: general.NftCollectionSource;
  website: string | null;
}

export interface InsertNftCollectionPrice {
  /**
   * insert a single row into the table: "nft_collection_price"
   */
  insert_nft_collection_price_one: InsertNftCollectionPrice_insert_nft_collection_price_one | null;
}

export interface InsertNftCollectionPriceVariables {
  id: string;
  name?: string | null;
  symbol?: string | null;
  source: general.NftCollectionSource;
  website?: string | null;
  price: general.numeric;
}
