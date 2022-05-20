import { NftWorth } from '@forbex-nxr/types';
import {
  faFingerprint,
  faPrint,
  faSun,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AddressLink } from '../address-link';
import { TokenLogo } from '../token-logo';
import { NumberUtils } from '../utils';

export const NFTCard: React.FC<NftWorth> = ({
  info,
  mint,
  type,
  collection,
  floorPrice,
  marketplace,
  worth,
}) => (
  <div className="flex flex-1 flex-col p-4 self-center hover:text-indigo-500 rounded-3xl shadow-lg bg-white">
    <div className="flex flex-col justify-center text-center relative ">
      {worth > 0 && (
        <span className="font-bold flex justify-center">
          <span className="flex text-xs">$ {NumberUtils.asHuman(worth)}</span>
        </span>
      )}
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
        <span className="flex flex-col my-4 ">
          <span className="font-semibold text-xl truncate flex justify-center">
            {info?.name.trim() ? info.name : '--/--'}
          </span>
          <span className="text-[9px] font-bold flex truncate justify-center">
            {collection?.family || '--/--'}&nbsp;|&nbsp;
            {collection?.name || '--/--'}&nbsp;|&nbsp;
            {collection?.symbol || '--/--'}
          </span>
        </span>
        {floorPrice && (
          <div className="flex flex-col">
            <div className="flex justify-center">
              <FontAwesomeIcon icon={faSun} className="mr-2 self-center" />
              <span className="flex justify-center font-bold">
                {floorPrice}
              </span>
            </div>
            <span className="text-[8px] font-bold uppercase">
              {marketplace}
            </span>
          </div>
        )}
      </AddressLink>
    </div>
  </div>
);
