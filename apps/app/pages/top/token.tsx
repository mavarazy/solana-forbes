import React from 'react';
import type { NextPage } from 'next';
import { TokenWorth } from '@forbex-nxr/types';
import { TokenWorthCard } from '../../components/token-worth-card';
import { TopTokens } from '../../utils/top-tokens';
import { faWallet } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export async function getStaticProps(context) {
  return {
    props: {
      tokens: TopTokens,
    },
    revalidate: 3600,
  };
}

const TopTokensPage: NextPage<{
  tokens: Array<TokenWorth & { count: number }>;
}> = ({ tokens }) => (
  <main className="flex flex-1 flex-col">
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
