import { NftWorth } from '@forbex-nxr/utils';
import { faFingerprint, faPrint } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AddressLink } from '../address-link';
import { TokenLogo } from '../token-logo';

export const NFTCard: React.FC<NftWorth> = ({ info, mint, type }) => (
  <div className="flex flex-1 flex-col p-4 self-center hover:text-indigo-500 rounded-3xl shadow-lg bg-white">
    <div className="flex flex-col justify-center text-center relative ">
      <FontAwesomeIcon
        icon={type === 'original' ? faFingerprint : faPrint}
        className="bg-gray-600 text-white h-6 w-6 absolute top-1 right-1 p-3 rounded-full"
      />
      <AddressLink address={mint}>
        {info?.logoURI && (
          <TokenLogo
            logoURI={info.logoURI}
            className="h-32 w-32 rounded-xl flex flex-1 items-center mx-auto object-cover my-4"
          />
        )}
        <span className="font-semibold my-4 text-xl truncate flex justify-center">
          {info?.name.trim() ? info.name : '--/--'}
        </span>
      </AddressLink>
    </div>
  </div>
);
