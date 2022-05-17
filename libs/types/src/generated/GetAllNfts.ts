/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetAllNfts
// ====================================================

export interface GetAllNfts_wallet {
  tokens: general.TokenWorthSummary;
}

export interface GetAllNfts {
  /**
   * fetch data from the table: "wallet"
   */
  wallet: GetAllNfts_wallet[];
}
