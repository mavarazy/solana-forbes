/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetLargestWallets
// ====================================================

export interface GetLargestWallets_wallet {
  id: string;
  sol: general.numeric;
  summary: general.TokenSummary;
  worth: general.numeric;
  program: boolean;
  change: general.numeric;
}

export interface GetLargestWallets {
  /**
   * fetch data from the table: "wallet"
   */
  wallet: GetLargestWallets_wallet[];
}
