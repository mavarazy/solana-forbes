/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetNftMarketplaceStats
// ====================================================

export interface GetNftMarketplaceStats_nft_collection_price_stats {
  count: bigint | null;
  marketplace: string | null;
}

export interface GetNftMarketplaceStats {
  /**
   * fetch data from the table: "nft_collection_price_stats"
   */
  nft_collection_price_stats: GetNftMarketplaceStats_nft_collection_price_stats[];
}
