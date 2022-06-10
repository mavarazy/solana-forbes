/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetAllPricedTokens
// ====================================================

export interface GetAllPricedTokens_wallet {
  tokens: general.TokenWorthSummary;
}

export interface GetAllPricedTokens {
  /**
   * fetch data from the table: "wallet"
   */
  wallet: GetAllPricedTokens_wallet[];
}
