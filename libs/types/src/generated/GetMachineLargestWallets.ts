/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetMachineLargestWallets
// ====================================================

export interface GetMachineLargestWallets_wallet {
  id: string;
  sol: general.numeric;
  summary: general.TokenSummary;
  worth: general.numeric;
  program: boolean;
}

export interface GetMachineLargestWallets {
  /**
   * fetch data from the table: "wallet"
   */
  wallet: GetMachineLargestWallets_wallet[];
}
