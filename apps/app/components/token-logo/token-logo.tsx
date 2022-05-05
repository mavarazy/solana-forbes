import { TokenInfo } from '@solana/spl-token-registry';

export const TokenLogo = ({
  logoURI,
  className,
}: Pick<TokenInfo, 'logoURI'> & { className: string }) => (
  <img
    src={logoURI ?? '/default-token-logo.svg'}
    onError={({ currentTarget }) => {
      if (currentTarget.src !== '/default-token-logo.svg') {
        currentTarget.onerror = null;
        currentTarget.src = '/default-token-logo.svg';
      }
    }}
    className={className}
  />
);
