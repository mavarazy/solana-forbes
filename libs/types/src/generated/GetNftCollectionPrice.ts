/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

import { NftMarketplace } from './globalTypes';

// ====================================================
// GraphQL query operation: GetNftCollectionPrice
// ====================================================

export interface GetNftCollectionPrice_nft_collection_price {
  id: string;
  name: string;
  price: general.numeric;
  marketplace: NftMarketplace;
  symbol: string | null;
}

export interface GetNftCollectionPrice {
  /**
   * fetch data from the table: "nft_collection_price"
   */
  nft_collection_price: GetNftCollectionPrice_nft_collection_price[];
}
