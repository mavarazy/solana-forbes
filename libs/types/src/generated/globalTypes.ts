/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import * as general from '../lib';

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum NftMarketplace {
  all = 'all',
  alphart = 'alphart',
  digitaleyes = 'digitaleyes',
  exchageart = 'exchageart',
  fractal = 'fractal',
  magiceden = 'magiceden',
  solanart = 'solanart',
  solport = 'solport',
  solsea = 'solsea',
}

/**
 * input type for inserting data into table "nft_collection_price_change"
 */
export interface nft_collection_price_change_insert_input {
  collection?: string | null;
  date?: general.date | null;
  id?: general.uuid | null;
  marketplace?: NftMarketplace | null;
  price?: general.numeric | null;
  volume?: general.numeric | null;
}

/**
 * input type for inserting data into table "token_worth_summary"
 */
export interface token_worth_summary_insert_input {
  amount?: general.numeric | null;
  count?: number | null;
  decimals?: general.numeric | null;
  info?: general.jsonb | null;
  mint?: string | null;
  percent?: general.numeric | null;
  source?: string | null;
  symbol?: string | null;
  usd?: general.numeric | null;
  worth?: general.numeric | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
