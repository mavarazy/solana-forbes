import { gql } from '@apollo/client';
import { hasuraClient, WalletBallance, WalletService } from '@forbex-nxr/utils';
import { NextPage } from 'next';
import { AddressLink } from '../../components/address-link';
import { useRouter } from 'next/router';
import { WorthCard } from '../../components/worth-card';
import { TokenPanel } from '../../components/token-panel';
import { NftPanel } from '../../components/nft-panel';

const GetLargestWalletIdsQuery = gql`
  query GetLargestWallets {
    wallet(limit: 10, order_by: { worth: desc }) {
      id
    }
  }
`;

const GetWalletByIdQuery = gql`
  query GetWalletById($id: String!) {
    wallet_by_pk(id: $id) {
      id
      sol
      tokens
      top
      worth
    }
  }
`;

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const {
    data: { wallet },
  } = await hasuraClient.query({ query: GetLargestWalletIdsQuery });

  // Get the paths we want to pre-render based on posts
  const paths = wallet.map((params) => ({
    params: params,
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: true };
}

const loadWalletFromHasura = async (id: string) => {
  const {
    data: { wallet_by_pk: wallet },
  } = await hasuraClient.query({
    query: GetWalletByIdQuery,
    variables: { id },
  });

  return wallet ?? null;
};

const loadWalletFromSolana = async (id: string) => {
  const wallet = await WalletService.getWalletBalance(id);
  return wallet;
};

const loadWallet = async (id: string) => {
  const wallet = await loadWalletFromSolana(id);
  if (wallet) {
    return wallet;
  }
  return loadWalletFromHasura(id);
};

// This also gets called at build time
export async function getStaticProps({ params: { id } }) {
  const wallet = await loadWallet(id);
  return { props: { wallet } };
}

interface WalletProps {
  wallet: WalletBallance;
}

const Wallet: NextPage = (props: WalletProps) => {
  const router = useRouter();
  const { wallet } = props;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const pricedTokens = wallet.tokens.filter((token) => token.worth > 0);

  const infoTokens = wallet.tokens.filter(
    (token) => token.worth === 0 && token.info && !token.usd
  );

  const devTokens = wallet.tokens.filter(
    (token) => token.worth === 0 && !token.info
  );

  const ownedNfts = wallet.nfts.filter((nft) => nft.owns);
  const previousNfts = wallet.nfts.filter((nft) => !nft.owns);

  return (
    <div className="p-10 bg-gray-200">
      <div className="mb-20">
        <AddressLink address={wallet.id}>
          <WorthCard wallet={wallet} />
        </AddressLink>
      </div>
      <TokenPanel name="Priced tokens" tokens={pricedTokens} />
      <TokenPanel name="Unpriced tokens" tokens={infoTokens} />
      <TokenPanel name="Dev tokens" tokens={devTokens} />
      <NftPanel name="NFT's" nfts={ownedNfts} />
      <NftPanel name="Previously owned NFT's" nfts={previousNfts} />
    </div>
  );
};

export default Wallet;
