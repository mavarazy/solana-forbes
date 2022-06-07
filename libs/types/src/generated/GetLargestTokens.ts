/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

// ====================================================
// GraphQL query operation: GetLargestTokens
// ====================================================

export interface GetLargestTokens_token_worth_summary {
  amount: general.numeric;
  count: number;
  decimals: general.numeric;
  info: general.jsonb | null;
  mint: string;
  percent: general.numeric;
  source: string;
  symbol: string;
  usd: general.numeric;
  worth: general.numeric;
}

export interface GetLargestTokens {
  /**
   * fetch data from the table: "token_worth_summary"
   */
  token_worth_summary: GetLargestTokens_token_worth_summary[];
}
