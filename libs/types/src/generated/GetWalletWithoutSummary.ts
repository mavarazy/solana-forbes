/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetWalletWithoutSummary
// ====================================================

export interface GetWalletWithoutSummary_wallet {
  id: string;
}

export interface GetWalletWithoutSummary {
  /**
   * fetch data from the table: "wallet"
   */
  wallet: GetWalletWithoutSummary_wallet[];
}
