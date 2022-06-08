/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

import { NftMarketplace } from './globalTypes';

// ====================================================
// GraphQL query operation: GetNftCollectionPricesWith
// ====================================================

export interface GetNftCollectionPricesWith_nft_collection_price {
  id: string;
  name: string;
  price: general.numeric;
  source: NftMarketplace;
  website: string | null;
  symbol: string | null;
  thumbnail: string | null;
}

export interface GetNftCollectionPricesWith {
  /**
   * fetch data from the table: "nft_collection_price"
   */
  nft_collection_price: GetNftCollectionPricesWith_nft_collection_price[];
}
