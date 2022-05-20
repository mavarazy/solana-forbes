import { gql } from '@apollo/client';
import { hasuraClient } from '@forbex-nxr/utils';
import { WalletBallance } from '@forbex-nxr/types';
import { NextPage } from 'next';
import { AddressLink } from '../../components/address-link';
import { useRouter } from 'next/router';
import { WorthCard } from '../../components/worth-card';
import { TokenPanel } from '../../components/token-panel';
import { NftPanel } from '../../components/nft-panel';

const GetTopLargestWalletIdsQuery = gql`
  query GetTopLargestWallets {
    wallet(limit: 500, order_by: { worth: desc }) {
      id
    }
  }
`;

const GetWalletByIdQuery = gql`
  query GetWalletById($id: String!) {
    wallet_by_pk(id: $id) {
      id
      sol
      worth
      tokens
      summary
      program
    }
  }
`;

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const {
    data: { wallet },
  } = await hasuraClient.query({ query: GetTopLargestWalletIdsQuery });

  // Get the paths we want to pre-render based on posts
  const paths = wallet.map((params) => ({
    params: params,
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: true };
}

const loadWallet = async (id: string) => {
  const {
    data: { wallet_by_pk: wallet },
  } = await hasuraClient.query({
    query: GetWalletByIdQuery,
    variables: { id },
  });
  if (wallet) {
    return wallet;
  }
};

// This also gets called at build time
export async function getStaticProps({ params: { id } }) {
  const wallet = await loadWallet(id);
  if (wallet) {
    return { props: { wallet }, revalidate: 3600 };
  }
  return {
    redirect: {
      destination: `/wallet/${id}`,
      permanent: false,
    },
  };
}

interface TopProps {
  wallet: WalletBallance;
}

const Top: NextPage<TopProps> = ({ wallet }) => {
  const router = useRouter();

  if (router.isFallback || !wallet) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <div className="text-4xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 m-2 sm:m-4 justify-center items-center">
      <div className="max-w-5xl flex flex-col flex-1">
        <AddressLink address={wallet.id}>
          <WorthCard wallet={wallet} />
        </AddressLink>
        <NftPanel
          name="Owned NFT's"
          nfts={wallet.tokens.nfts.filter((nft) => nft.owns)}
        />
        <NftPanel
          name="Previously owned NFT's"
          nfts={wallet.tokens.nfts.filter((nft) => !nft.owns)}
        />
        <TokenPanel
          type="priced"
          name="Priced tokens"
          tokens={wallet.tokens.priced}
        />
        <TokenPanel
          type="general"
          name="General tokens"
          tokens={wallet.tokens.general}
        />
        <TokenPanel type="dev" name="Dev tokens" tokens={wallet.tokens.dev} />
      </div>
    </div>
  );
};

export default Top;
