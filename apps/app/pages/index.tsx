import React from 'react';
import type { NextPage } from 'next';
import { ForbesList } from '../components/forbes-table';
import { gql } from '@apollo/client';
import { hasuraClient } from '@forbex-nxr/utils';
import { WalletBallance } from '@forbex-nxr/types';
import { TokenInfo } from '@solana/spl-token-registry';

const GetLargestWalletsQuery = gql`
  query GetLargestWallets {
    wallet(order_by: { worth: desc }, limit: 500) {
      id
      sol
      summary
      worth
      program
    }
  }
`;

export async function getStaticProps(context) {
  const {
    data: { wallet },
  } = await hasuraClient.query({ query: GetLargestWalletsQuery });

  return {
    props: {
      wallets: wallet,
    },
    revalidate: 3600,
  };
}

const Home: NextPage<{
  wallets: Array<
    Omit<WalletBallance, 'tokens'> & {
      info: TokenInfo;
    }
  >;
}> = ({ wallets }) => (
  <main className="flex flex-1 flex-col">
    <ForbesList wallets={wallets} />
  </main>
);

export default Home;
