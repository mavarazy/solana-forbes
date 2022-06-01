/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetLargestWalletWithFlag
// ====================================================

export interface GetLargestWalletWithFlag_wallet {
  id: string;
  sol: general.numeric;
  summary: general.TokenSummary;
  worth: general.numeric;
  program: boolean;
  change: general.numeric;
}

export interface GetLargestWalletWithFlag {
  /**
   * fetch data from the table: "wallet"
   */
  wallet: GetLargestWalletWithFlag_wallet[];
}

export interface GetLargestWalletWithFlagVariables {
  program?: boolean | null;
}
