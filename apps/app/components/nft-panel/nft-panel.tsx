import { NftWorth } from '@forbex-nxr/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHexagonVerticalNft } from '@fortawesome/pro-light-svg-icons';
import { NFTCard } from '../nft-card';

interface TokenPanelProps {
  name: string;
  nfts: NftWorth[];
}

export const NftPanel = ({ nfts, name }: TokenPanelProps) =>
  nfts.length > 0 && (
    <>
      <span className="flex text-4xl my-10">
        <FontAwesomeIcon
          icon={faHexagonVerticalNft}
          className="m-4 h-16 w-16 flex"
        />
        <span className="border flex self-center">
          {name} ({nfts.length})
        </span>
      </span>
      <div
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {nfts.map((nft) => (
          <NFTCard key={nft.mint} {...nft} />
        ))}
      </div>
    </>
  );
