import { TokenWorth } from '@solana-forbes/types';
import { NumberUtils } from '../utils';
import { AddressLink } from '../address-link';
import { TokenLogo } from '../token-logo';
import { Card } from '../card';
import { Badge } from '../badge';

export const TokenWorthCard: React.FC<TokenWorth> = ({
  amount,
  decimals,
  usd,
  info,
  mint,
  worth,
  percent,
  source,
  symbol,
}) => (
  <Card>
    <div className="flex flex-col justify-center text-center">
      {worth > 0 && (
        <span className="text-xs mb-4 font-bold">
          $ {NumberUtils.asHuman(worth)}
        </span>
      )}
      <AddressLink address={mint}>
        <span className="h-14 w-14 rounded-full flex flex-1 items-center mx-auto p-1 bg-white shadow-lg">
          <TokenLogo
            image={info?.logoURI}
            width={56}
            height={56}
            className="rounded-full"
          />
        </span>
        {percent > 1 && (
          <span className="absolute top-4 right-4">
            <Badge>{percent.toFixed(1)} %</Badge>
          </span>
        )}
        <span className="items-center font-semibold mt-2 text-[8px] xl:text-[10px]">
          {info?.name ? info.name : mint}
        </span>
        {usd > 0 && (
          <div className="flex justify-center mt-0.5">
            <span className="text-xs font-semibold">
              USD: {usd && NumberUtils.asHuman(usd)}
            </span>
          </div>
        )}
        <div className="flex justify-center">
          <span>{NumberUtils.asHuman(amount / Math.pow(10, decimals))}</span>
          <span className="text-xs font-light self-center pl-2">{symbol}</span>
        </div>
        <span className="flex justify-center text-[8px] font-bold uppercase">
          {source}
        </span>
      </AddressLink>
    </div>
  </Card>
);
