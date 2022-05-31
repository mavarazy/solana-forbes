/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetHumanLargestWallets
// ====================================================

export interface GetHumanLargestWallets_wallet {
  id: string;
  sol: general.numeric;
  summary: general.TokenSummary;
  worth: general.numeric;
  program: boolean;
}

export interface GetHumanLargestWallets {
  /**
   * fetch data from the table: "wallet"
   */
  wallet: GetHumanLargestWallets_wallet[];
}
