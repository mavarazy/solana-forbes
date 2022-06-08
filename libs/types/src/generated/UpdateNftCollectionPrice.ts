/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

import { NftMarketplace } from './globalTypes';

// ====================================================
// GraphQL mutation operation: UpdateNftCollectionPrice
// ====================================================

export interface UpdateNftCollectionPrice_update_nft_collection_price_by_pk {
  id: string;
  name: string;
  price: general.numeric;
  source: NftMarketplace;
  symbol: string | null;
  website: string | null;
  thumbnail: string | null;
}

export interface UpdateNftCollectionPrice {
  /**
   * update single row of the table: "nft_collection_price"
   */
  update_nft_collection_price_by_pk: UpdateNftCollectionPrice_update_nft_collection_price_by_pk | null;
}

export interface UpdateNftCollectionPriceVariables {
  id: string;
  name?: string | null;
  symbol?: string | null;
  website?: string | null;
  thumbnail?: string | null;
  price: general.numeric;
}
