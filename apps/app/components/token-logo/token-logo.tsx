import { TokenInfo } from "@solana/spl-token-registry";

export const TokenLogo = ({
  logoURI,
  size: width,
  className,
}: Pick<TokenInfo, "logoURI"> & { size: number; className: string }) => (
  <img
    src={logoURI ?? "/default-token-logo.svg"}
    width={width}
    height={width}
    onError={({ currentTarget }) => {
      if (currentTarget.src !== "/default-token-logo.svg") {
        currentTarget.onerror = null;
        currentTarget.src = "/default-token-logo.svg";
      }
    }}
    className={className}
  />
);
