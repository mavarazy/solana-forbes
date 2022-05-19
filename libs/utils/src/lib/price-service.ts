import { Mint } from '@solana/spl-token';
import { TokenPrice, WalletBallance } from '@forbex-nxr/types';
import { USDPriceMap } from './usd-price-map';
import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';
import { WorthUtils } from './worth-utils';
import { throttle } from './throttle';

const getCoingeckoPrice = async (
  coingeckoId?: string
): Promise<{ usd: number; cap: number } | null> => {
  if (!coingeckoId) {
    return null;
  }

  console.log('Getting price for ', coingeckoId);

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coingeckoId}`
    );
    const {
      market_data: {
        current_price: { usd },
        market_cap: { usd: cap },
      },
    } = await res.json();
    console.log('Getting price for ', coingeckoId, 'usd: ', usd, ', cap:', cap);
    return { usd, cap };
  } catch (err) {
    console.error(`Failed to fetch ${coingeckoId} ${err}`);
  }

  return null;
};

const getTokenMint = async (
  connection: Connection,
  address: string
): Promise<Mint | null> => {
  try {
    const mint = await getMint(connection, new PublicKey(address));
    return mint;
  } catch (err) {
    return null;
  }
};

const loadTokenPrice = async (
  connection: Connection,
  coingeckoId: string,
  mint: string
): Promise<TokenPrice | null> => {
  const price = await getCoingeckoPrice(coingeckoId);
  if (!price) {
    console.log('Price is missing for ', coingeckoId);
    return null;
  }

  console.log('Extracting mint: ', mint);
  const tokenMint = await getTokenMint(connection, mint);
  if (!tokenMint) {
    return null;
  }

  return {
    mint,
    ...price,
    decimals: tokenMint.decimals,
    coingeckoId,
    supply: Number(tokenMint.supply) / Math.pow(10, tokenMint.decimals),
  };
};

const getSolPrice = (): number =>
  USDPriceMap['So11111111111111111111111111111111111111112'].usd;

const refresh = async (
  connection: Connection,
  balance: WalletBallance
): Promise<WalletBallance> => {
  const priced = await throttle(
    balance.tokens.priced.map((token) => async () => {
      const oldPrice: TokenPrice | undefined = USDPriceMap[token.mint];
      if (!oldPrice && (oldPrice as TokenPrice).coingeckoId) {
        return token;
      }

      const currentPrice = await loadTokenPrice(
        connection,
        (oldPrice as TokenPrice).coingeckoId!,
        token.mint
      );

      if (currentPrice) {
        return {
          ...token,
          usd: currentPrice.usd,
          worth: WorthUtils.getTokenWorth(token.amount, currentPrice),
        };
      }
      return token;
    }),
    1000,
    5
  );

  const solPrice = await getCoingeckoPrice('solana');

  return {
    ...balance,
    tokens: {
      ...balance.tokens,
      priced,
    },
    worth: priced.reduce(
      (sum, { worth }) => sum + worth,
      balance.sol * (solPrice?.usd ?? getSolPrice())
    ),
  };
};

export const PriceService = {
  getSolPrice,
  loadTokenPrice,
  getTokenMint,
  refresh,
};
