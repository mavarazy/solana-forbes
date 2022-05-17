/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetAllWallets
// ====================================================

export interface GetAllWallets_wallet {
  id: string;
}

export interface GetAllWallets {
  /**
   * fetch data from the table: "wallet"
   */
  wallet: GetAllWallets_wallet[];
}
