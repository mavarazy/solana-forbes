import { gql } from '@apollo/client';
import {
  hasuraClient,
  PriceService,
  WalletBallance,
  WalletRepository,
  WalletService,
} from '@forbex-nxr/utils';
import { NextPage } from 'next';
import { AddressLink } from '../../components/address-link';
import { useRouter } from 'next/router';
import { WorthCard } from '../../components/worth-card';
import { TokenPanel } from '../../components/token-panel';
import { NftPanel } from '../../components/nft-panel';
import { useEffect, useState } from 'react';

const GetLargestWalletIdsQuery = gql`
  query GetLargestWallets {
    wallet(limit: 25, order_by: { worth: desc }) {
      id
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

const loadWallet = async (id: string) => {
  try {
    const wallet = await WalletRepository.getById(id);
    if (wallet) {
      return wallet;
    }
  } catch (err) {
    return null;
  }
  return WalletService.getWalletBalance(id);
};

// This also gets called at build time
export async function getStaticProps({ params: { id } }) {
  const wallet = await loadWallet(id);
  if (wallet) {
    return { props: { wallet } };
  }
  return { props: { id } };
}

interface WalletProps {
  id?: string;
  wallet: WalletBallance | null;
}

const Wallet: NextPage = (props: WalletProps) => {
  const router = useRouter();
  const { id } = props;
  const [wallet, setWallet] = useState<WalletBallance>(props.wallet);

  useEffect(() => {
    if (id) {
      WalletService.getWalletBalance(id).then((wallet) => {
        setWallet(wallet);
      });
    }
  }, [id]);

  if (router.isFallback || !wallet) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <div className="text-4xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-200">
      <div className="mb-20">
        <AddressLink address={wallet.id}>
          <WorthCard wallet={wallet} />
        </AddressLink>
      </div>
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
  );
};

export default Wallet;
