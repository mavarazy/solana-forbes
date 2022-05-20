/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetAllWalletsUpdatedBefore
// ====================================================

export interface GetAllWalletsUpdatedBefore_wallet {
  id: string;
}

export interface GetAllWalletsUpdatedBefore {
  /**
   * fetch data from the table: "wallet"
   */
  wallet: GetAllWalletsUpdatedBefore_wallet[];
}

export interface GetAllWalletsUpdatedBeforeVariables {
  updatedBefore?: general.timestamptz | null;
}
