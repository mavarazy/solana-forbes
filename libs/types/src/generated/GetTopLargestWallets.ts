/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetTopLargestWallets
// ====================================================

export interface GetTopLargestWallets_wallet {
  id: string;
}

export interface GetTopLargestWallets {
  /**
   * fetch data from the table: "wallet"
   */
  wallet: GetTopLargestWallets_wallet[];
}
