import { Mint, RawAccount } from '@solana/spl-token';
import { TokenInfo, TokenListProvider } from '@solana/spl-token-registry';
import { TokenInfoSummary, TokenPrice, TokenWorth } from './types';
import { USDPriceMap } from './usd-price-map';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

const getPrice = async (
  coingeckoId: string
): Promise<{ usd: number; cap: number } | null> => {
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

const tokenMap: Promise<{ [key in string]: TokenInfoSummary }> = new Promise(
  (resolve) => {
    new TokenListProvider().resolve().then((resolvedTokens) => {
      const tokenMap = resolvedTokens.getList().reduce(
        (agg, tokenInfo) =>
          Object.assign(agg, {
            [tokenInfo.address]: { name: tokenInfo.name },
          }),
        {}
      );

      resolve(tokenMap);
    });
  }
);

const getTokenMint = async (address: string): Promise<Mint | null> => {
  try {
    const connection = new Connection(
      clusterApiUrl('mainnet-beta'),
      'confirmed'
    );
    const mint = await getMint(connection, new PublicKey(address));
    return mint;
  } catch (err) {
    return null;
  }
};

const loadTokenPrice = async (token: TokenInfo): Promise<TokenPrice | null> => {
  if (!token.extensions?.coingeckoId) {
    console.log('No coingecko extension for ', token.name);
    return null;
  }

  const price = await PriceService.getPrice(token.extensions.coingeckoId);
  if (!price) {
    console.log('Price is missing for ', token.name);
    return null;
  }

  console.log('Extracting mint: ', token.address);
  const mint = await getTokenMint(token.address);
  if (!mint) {
    return null;
  }

  return {
    mint: token.address,
    ...price,
    decimals: mint.decimals,
    supply: Number(mint.supply) / Math.pow(10, mint.decimals),
  };
};

const getSolPrice = (): number =>
  USDPriceMap['So11111111111111111111111111111111111111112'].usd;

const getTokenWorth = async (account: RawAccount): Promise<TokenWorth> => {
  const mint = account.mint.toString();
  const price = USDPriceMap[mint];
  const info = (await tokenMap)[mint];
  if (price) {
    const { decimals, usd, cap } = price;
    const amount = Number(account.amount) / Math.pow(10, decimals);
    const percent = (100 * amount) / price.supply;
    const worth = Math.min(usd * amount, (percent * cap) / 100);
    return {
      mint,
      amount,
      worth,
      info,
      usd: price.usd,
      percent,
    };
  } else {
    return {
      mint,
      info,
      amount: Number(account.amount),
      worth: 0,
    };
  }
};

export const PriceService = {
  getPrice,
  getSolPrice,
  getTokenWorth,
  loadTokenPrice,
};
