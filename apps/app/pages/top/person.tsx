import React from 'react';
import type { NextPage } from 'next';
import { ForbesList } from '../../components/forbes-table';
import { hasuraClient } from '@forbex-nxr/utils';
import {
  GetLargestWalletWithFlag,
  GetLargestWalletWithFlagVariables,
  WalletBalance,
} from '@forbex-nxr/types';
import { TokenInfo } from '@solana/spl-token-registry';
import { GetLargestWalletWithFlagQuery } from '../../utils/get-largest-wallet';

export async function getStaticProps(context) {
  const {
    data: { wallet },
  } = await hasuraClient.query<
    GetLargestWalletWithFlag,
    GetLargestWalletWithFlagVariables
  >({ query: GetLargestWalletWithFlagQuery, variables: { program: false } });

  return {
    props: {
      wallets: wallet,
    },
    revalidate: 3600,
  };
}

const TopPersonPage: NextPage<{
  wallets: Array<
    Omit<WalletBalance, 'tokens'> & {
      info: TokenInfo;
    }
  >;
}> = ({ wallets }) => (
  <main className="flex flex-1 flex-col">
    <div className="flex flex-1 m-2 sm:m-4 justify-center items-center">
      <div className="max-w-5xl flex flex-col flex-1 self-start">
        <h1 className="text-3xl mt-3 tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
          <span className="xl:inline ml-2">Personal</span>{' '}
          <span className="text-brand xl:inline">wallets</span>
        </h1>
        <h1 className="text-xl ml-3 sm:ml-5 mb-3 tracking-tight font-extrabold text-brand">
          Top 250 accounts on Solana
        </h1>
      </div>
    </div>
    <ForbesList wallets={wallets} />
  </main>
);

export default TopPersonPage;
