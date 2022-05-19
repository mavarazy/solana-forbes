import { WalletBallance } from '@forbex-nxr/types';
import { NextPage } from 'next';
import { AddressLink } from '../../components/address-link';
import { WorthCard } from '../../components/worth-card';
import { TokenPanel } from '../../components/token-panel';
import { NftPanel } from '../../components/nft-panel';
import { WalletService } from '@forbex-nxr/utils';
import { useEffect, useState } from 'react';
import { clusterApiUrl, Connection } from '@solana/web3.js';

// This function gets called at build time
export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

// This also gets called at build time
export async function getStaticProps({ params: { id } }) {
  return { props: { id } };
}

interface WalletProps {
  id: string;
}

const Wallet: NextPage<WalletProps> = ({ id }) => {
  const [wallet, setWallet] = useState<WalletBallance>({
    id,
    worth: 0,
    sol: 0,
    top: [],
    summary: {},
    tokens: {
      priced: [],
      general: [],
      dev: [],
      nfts: [],
    },
    program: true,
  });

  useEffect(() => {
    if (id) {
      const connection = new Connection(
        clusterApiUrl('mainnet-beta'),
        'confirmed'
      );
      WalletService.getWalletBalance(connection, id).then(setWallet);
    }
  }, [id]);

  return (
    <div className="flex flex-1 m-2 sm:m-4 justify-center items-center">
      <div className="max-w-5xl flex flex-col flex-1">
        <AddressLink address={id}>
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

export default Wallet;
