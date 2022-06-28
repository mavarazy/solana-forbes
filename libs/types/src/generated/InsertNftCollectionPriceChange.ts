/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

import {
  nft_collection_price_change_insert_input,
  NftMarketplace,
} from './globalTypes';

// ====================================================
// GraphQL mutation operation: InsertNftCollectionPriceChange
// ====================================================

export interface InsertNftCollectionPriceChange_insert_nft_collection_price_change_one {
  id: general.uuid;
  marketplace: NftMarketplace;
  price: general.numeric;
  volume: general.numeric;
  date: general.date;
  collection: string;
}

export interface InsertNftCollectionPriceChange {
  /**
   * insert a single row into the table: "nft_collection_price_change"
   */
  insert_nft_collection_price_change_one: InsertNftCollectionPriceChange_insert_nft_collection_price_change_one | null;
}

export interface InsertNftCollectionPriceChangeVariables {
  change?: nft_collection_price_change_insert_input | null;
}
