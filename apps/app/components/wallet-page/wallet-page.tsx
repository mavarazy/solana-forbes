import { WalletBallance } from '@forbex-nxr/types';
import { AddressLink } from '../address-link';
import { NftPanel } from '../nft-panel';
import { TokenPanel } from '../token-panel';
import { WorthCard } from '../worth-card';

export const WalletPage = (wallet: WalletBallance) => (
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
