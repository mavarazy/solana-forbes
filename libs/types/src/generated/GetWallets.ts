/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetWallets
// ====================================================

export interface GetWallets_wallet {
  id: string;
  worth: general.numeric;
}

export interface GetWallets {
  /**
   * fetch data from the table: "wallet"
   */
  wallet: GetWallets_wallet[];
}

export interface GetWalletsVariables {
  wallets?: string[] | null;
}
