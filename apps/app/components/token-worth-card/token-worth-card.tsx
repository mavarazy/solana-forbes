import { NumberUtils, TokenWorth } from '@forbex-nxr/utils';
import { AddressLink } from '../address-link';
import { TokenLogo } from '../token-logo';

export const TokenWorthCard: React.FC<TokenWorth> = ({
  amount,
  usd,
  info,
  mint,
  worth,
  percent,
}) => (
  <div className="flex flex-1 flex-col p-4 self-center hover:bg-indigo-500 hover:text-white shadow-lg rounded-3xl bg-white">
    <div className="flex flex-col justify-center text-center relative ">
      <span className="text-xs mb-4 font-bold">
        $ {NumberUtils.asHuman(worth)}
      </span>
      <AddressLink address={mint}>
        {info?.logoURI && (
          <TokenLogo
            logoURI={info.logoURI}
            className="h-14 w-14 rounded-full flex flex-1 items-center mx-auto p-1 bg-white shadow-lg"
          />
        )}
        {percent > 1 && (
          <span className="absolute top-0 right-0 text-xs font-bold bg-green-500 px-2 py-0.5 rounded-full text-white shadow-lg">
            {percent.toFixed(1)} %
          </span>
        )}
        <div className="flex justify-center mt-0.5">
          <span className="text-xs font-semibold">USD: {usd && usd}</span>
        </div>
        {info?.name ? (
          <span className="items-center font-semibold mt-2 text-xl truncate">
            {info.name}
          </span>
        ) : (
          <span className="items-center font-semibold mt-2 text-xs truncate">
            {mint}
          </span>
        )}
        <div className="flex justify-center">
          <span>{NumberUtils.asHuman(amount)}</span>
        </div>
      </AddressLink>
    </div>
  </div>
);
