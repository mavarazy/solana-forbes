import React from 'react';
import type { NextPage } from 'next';
import { ForbesList } from '../components/forbes-table';
import { WalletBallance } from '../context';
import { gql } from '@apollo/client';
import { hasuraClient } from '@forbex-nxr/utils';
import { TokenListProvider } from '@solana/spl-token-registry';

const GetLargestWalletsQuery = gql`
  query GetLargestWallets {
    wallet(limit: 200, order_by: { worth: desc }) {
      id
      top
      worth
    }
  }
`;

export async function getStaticProps(context) {
  const {
    data: { wallet },
  } = await hasuraClient.query({ query: GetLargestWalletsQuery });

  const resolvedTokens = await new TokenListProvider().resolve();

  const tokenMap = resolvedTokens
    .getList()
    .reduce(
      (agg, tokenInfo) =>
        Object.assign(agg, { [tokenInfo.address]: tokenInfo }),
      {}
    );

  const wallets = wallet.map((wallet) =>
    Object.assign(
      { ...wallet },
      {
        top: wallet.top.map((top) =>
          tokenMap[top.mint] ? { ...top, info: tokenMap[top.mint] } : top
        ),
      }
    )
  );

  return {
    props: {
      wallets,
    }, // will be passed to the page component as props
  };
}

const Home: NextPage<{
  wallets: Array<Pick<WalletBallance, 'id' | 'worth' | 'top'>>;
}> = ({ wallets }) => (
  <main className="flex flex-1 flex-col">
    <ForbesList wallets={wallets} />
  </main>
);

export default Home;
