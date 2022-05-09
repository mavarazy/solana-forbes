import { NftWorth } from '@forbex-nxr/utils';
import { AddressLink } from '../address-link';
import { TokenLogo } from '../token-logo';

export const NFTCard: React.FC<NftWorth> = ({ info, mint }) => (
  <div className="flex flex-1 flex-col p-4 self-center hover:text-indigo-500 rounded-3xl shadow-lg bg-white">
    <div className="flex flex-col justify-center text-center relative ">
      <AddressLink address={mint}>
        {info?.logoURI && (
          <TokenLogo
            logoURI={info.logoURI}
            className="h-32 w-32 rounded-xl flex flex-1 items-center mx-auto object-cover my-4"
          />
        )}
        <span className="font-semibold my-4 text-xl truncate flex justify-center">
          {info?.name ?? mint}
        </span>
      </AddressLink>
    </div>
  </div>
);
