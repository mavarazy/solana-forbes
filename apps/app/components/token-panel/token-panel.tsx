import { TokenType, TokenWorth } from '@forbex-nxr/utils';
import { TokenWorthCard } from '../../components/token-worth-card';
import { useMemo } from 'react';
import { TokenToggle } from './token-toggle';
import { useToggle } from 'react-use';
import { TokenTypeIcon } from '../token-type-icon';

interface TokenPanelProps {
  type: TokenType;
  name: string;
  tokens: TokenWorth[];
}

export const TokenPanel = ({ type, tokens, name }: TokenPanelProps) => {
  const [toggle, onToggle] = useToggle(false);
  const [zeroTokens, nonZeroTokens] = useMemo(
    () =>
      tokens.reduce(
        ([zero, nonZero], token) =>
          token.amount === 0
            ? [zero.concat(token), nonZero]
            : [zero, nonZero.concat(token)],
        [[], []]
      ),
    [tokens]
  );

  if (tokens.length === 0) {
    return null;
  }

  return (
    <>
      <span className="flex text-xl md:text-4xl my-10">
        <TokenTypeIcon
          type={type}
          className="m-4 h-8 w-8 md:h-16 md:w-16 flex"
        />
        <div className="flex flex-1 flex-col justify-center">
          <span className="flex self-start">
            {name} ({nonZeroTokens.length})
          </span>
          <span className="flex text-xs font-bold text-gray-500">
            {zeroTokens.length} with no amount
          </span>
        </div>
        {zeroTokens.length > 0 && (
          <div className="flex self-center justify-center">
            <TokenToggle enabled={toggle} onToggle={onToggle} />
          </div>
        )}
      </span>
      <div
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {(toggle ? tokens : nonZeroTokens).map((token) => (
          <TokenWorthCard key={token.mint} {...token} />
        ))}
      </div>
    </>
  );
};
