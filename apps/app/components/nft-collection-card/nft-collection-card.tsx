import { NftCollectionPrice } from '@forbex-nxr/types';
import { faSun } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TokenLogo } from '../token-logo';

export const NFTCollectionCard: React.FC<NftCollectionPrice> = ({
  thumbnail,
  name,
  price,
  source,
}) => (
  <div className="flex flex-1 flex-col p-4 self-center hover:text-indigo-500 rounded-3xl shadow-lg bg-white">
    <div className="flex flex-col justify-center text-center">
      <div>
        <TokenLogo
          image={thumbnail}
          width={128}
          height={128}
          className="h-32 w-32 rounded-full flex flex-1 self-center mx-auto object-cover my-4"
        />
        <span className="flex flex-col my-4 ">
          <span className="font-semibold text-xl truncate flex justify-center">
            {name}
          </span>
        </span>
        <div className="flex flex-col">
          <div className="flex justify-center">
            <FontAwesomeIcon icon={faSun} className="mr-2 self-center" />
            <span className="flex justify-center font-bold">{price}</span>
          </div>
          <span className="text-[8px] font-bold uppercase">{source}</span>
        </div>
      </div>
    </div>
  </div>
);
