import { NumberUtils, TokenWorth } from '@forbex-nxr/utils';
import { TokenInfo } from '@solana/spl-token-registry';
import { AddressLink } from '../address-link';
import { TokenLogo } from '../token-logo';

export const TokenWelth: React.FC<TokenWorth & { info?: TokenInfo }> = ({
  amount,
  usd,
  mint,
  info,
  percent,
}) => (
  <div className="flex flex-1 flex-col p-4 self-center hover:text-indigo-500 border first:rounded-bl-lg last:rounded-br-lg">
    <div className="flex flex-col justify-center text-center relative ">
      <AddressLink address={mint}>
        {info && info.logoURI && (
          <TokenLogo
            logoURI={info.logoURI}
            className="h-12 w-12 rounded-full flex flex-1 items-center mx-auto"
          />
        )}
        {percent > 1 && (
          <span className="absolute top-0 right-0 text-xs font-bold bg-gray-500 px-2 py-0.5 rounded-full text-white shadow-lg">
            {percent.toFixed(1)} %
          </span>
        )}
        <div className="flex justify-center mt-0.5">
          <span className="text-xs font-semibold">USD: {usd && usd}</span>
        </div>
        <span className="items-center font-semibold mt-2 text-xl truncate">
          {info?.name}
        </span>
        <div className="flex justify-center">
          <span>{NumberUtils.asHuman(amount)}</span>
        </div>
      </AddressLink>
    </div>
  </div>
);
