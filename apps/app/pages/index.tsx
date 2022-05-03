import React from 'react';
import type { NextPage } from 'next';
import { ForbesTable } from '../components/forbes-table';
import { useGlobalState } from '../context';
import { TokenLogo } from '../components/token-logo';
import { TokenInfo } from '@solana/spl-token-registry';

const TokenPanel = ({ token }: { token: TokenInfo }) => (
  <div className="p-2 m-2 border-2 rounded-full flex">
    <TokenLogo {...token} size={48} className="h-8 w-8 mr-4 rounded-full" />
    <span className="font-base self-center text-xl">{token.name}</span>
  </div>
);

const Home: NextPage = () => {
  const {
    state: { currentToken },
  } = useGlobalState();

  return (
    <main className="flex flex-1 flex-col">
      <TokenPanel token={currentToken} />
      <ForbesTable />
    </main>
  );
};

export default Home;
