import React from 'react';
import type { NextPage } from 'next';
import { ForbesList } from '../components/forbes-table';
import { gql } from '@apollo/client';
import { hasuraClient, WalletBallance } from '@forbex-nxr/utils';
import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';

const GetLargestWalletsQuery = gql`
  query GetLargestWallets {
    wallet(
      order_by: { worth: desc }
      where: { nfts: { _gt: "0" } }
      limit: 50
    ) {
      id
      nfts
      sol
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
    },
  };
}

const Home: NextPage<{
  wallets: Array<
    Omit<WalletBallance, 'tokens'> & {
      info: TokenInfo;
    }
  >;
}> = ({ wallets }) => (
  <main className="flex flex-1 flex-col bg-gray-200">
    <ForbesList wallets={wallets} />
  </main>
);

export default Home;
