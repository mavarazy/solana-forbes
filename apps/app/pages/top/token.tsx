import React from 'react';
import type { NextPage } from 'next';
import { TokenWorth } from '@forbex-nxr/types';
import { TokenWorthCard } from '../../components/token-worth-card';
import { faWallet } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { gql } from '@apollo/client';
import { hasuraClient } from '@forbex-nxr/utils';

export const GetLargestTokensQuery = gql`
  query GetLargestTokens {
    token_worth_summary(order_by: { worth: desc }, limit: 150) {
      amount
      count
      decimals
      info
      mint
      percent
      source
      symbol
      usd
      worth
    }
  }
`;

export async function getStaticProps(_context) {
  const {
    data: { token_worth_summary: tokens },
  } = await hasuraClient.query({
    query: GetLargestTokensQuery,
  });

  return {
    props: {
      tokens,
    },
    revalidate: 3600,
  };
}

const TopTokensPage: NextPage<{
  tokens: Array<TokenWorth & { count: number }>;
}> = ({ tokens }) => (
  <main className="flex flex-1 flex-col">
    <div className="flex flex-1 m-2 sm:m-4 justify-center items-center">
      <div className="max-w-5xl flex flex-col flex-1 self-start">
        <h1 className="text-3xl mt-3 tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
          <span className="xl:inline ml-2">Tokens</span>{' '}
          <span className="text-brand xl:inline">by worth</span>
        </h1>
        <h1 className="text-xl ml-3 sm:ml-5 mb-3 tracking-tight font-extrabold text-brand">
          In top 500 wallets on Solana
        </h1>
      </div>
    </div>
    <div className="flex flex-1 m-2 sm:m-4 justify-center items-center">
      <div className="max-w-5xl flex flex-col flex-1">
        <div
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tokens.map((token) => (
            <div key={token.mint} className="relative">
              <span className="absolute top-4 left-4 text-xs text-white font-bold bg-green-500 rounded-full px-2 py-1">
                <FontAwesomeIcon
                  icon={faWallet}
                  className="h-3 w-3"
                  aria-hidden="true"
                />
                <span className="ml-1">{token.count}</span>
              </span>
              <TokenWorthCard key={token.mint} {...token} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
);

export default TopTokensPage;
