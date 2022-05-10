import { TokenInfo } from '@solana/spl-token-registry';

export const TokenLogo = ({
  logoURI,
  className,
}: Pick<TokenInfo, 'logoURI'> & { className: string }) => (
  <img
    src={logoURI ?? '/default-token-logo.svg'}
    alt="Token name"
    className={className}
  />
);
