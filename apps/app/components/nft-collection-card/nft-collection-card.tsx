import { NftCollectionPrice } from '@forbex-nxr/types';
import { faHashtag, faSun } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TokenLogo } from '../token-logo';

export const NFTCollectionCard: React.FC<NftCollectionPrice> = ({
  thumbnail,
  website,
  name,
  price,
  parent,
  marketplace,
  volume,
  supply,
}) => (
  <div className="flex flex-1 flex-col p-4 self-center hover:bg-indigo-500 hover:text-white shadow-2xl rounded-3xl bg-white cursor-pointer">
    <a
      className="flex flex-col justify-center text-center"
      href={website}
      target="_blank"
      rel="noreferrer"
    >
      <div>
        <TokenLogo
          image={thumbnail}
          width={128}
          height={128}
          className="h-32 w-32 rounded-full flex flex-1 self-center mx-auto object-cover my-2 bg-brand"
        />
        <span className="flex flex-col my-2 relative">
          <span className="font-semibold text-xl truncate flex justify-center">
            {name}
          </span>
          {parent && parent !== name && (
            <span className="absolute left-0 font-bold right-0 -bottom-2 text-[8px] uppercase">
              {parent}
            </span>
          )}
        </span>
        <div className="flex">
          <div className="flex flex-1 flex-col">
            <span className="text-[5px] font-bold uppercase">Floor price</span>
            <div className="flex justify-center">
              <FontAwesomeIcon icon={faSun} className="mr-2 self-center" />
              <span className="flex justify-center font-bold">{price}</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center">
            <span className="text-[5px] font-bold uppercase">Volume</span>
            <div className="flex justify-center">
              <FontAwesomeIcon icon={faSun} className="mr-2 self-center" />
              <span className="flex justify-center font-bold">
                {Math.round(volume).toLocaleString()}
              </span>
            </div>
          </div>
          {supply > 0 && (
            <div className="flex flex-1 flex-col justify-center">
              <span className="text-[5px] font-bold uppercase">Supply</span>
              <div className="flex justify-center">
                <FontAwesomeIcon
                  icon={faHashtag}
                  className="mr-2 self-center"
                />
                <span className="flex justify-center font-bold">{supply}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <span className="text-[8px] font-bold uppercase">{marketplace}</span>
    </a>
  </div>
);
