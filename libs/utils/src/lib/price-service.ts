import { TokenPriceMap } from '@forbex-nxr/types';
import { TokenListProvider } from '@solana/spl-token-registry';

interface RaydiumToken {
  mint: string;
  decimals: number;
  extensions?: { coingeckoId?: string };
  icon?: string;
  name?: string;
  symbol?: string;
}

interface RaydiumTokenResponse {
  blacklist: string[];
  name: string;
  official: RaydiumToken[];
  timestamp: string;
  unNamed: RaydiumToken[];
  unOfficial: RaydiumToken[];
  version: { major: number; minor: number; patch: number };
}

interface RaydiumPair {
  ammId: string;
  apr7d: number;
  apr24h: number;
  apr30d: number;
  fee7d: number;
  fee7dQuote: number;
  fee24h: number;
  fee24hQuote: number;
  fee30d: number;
  fee30dQuote: number;
  liquidity: number;
  lpMint: string;
  lpPrice: number;
  market: string;
  name: string;
  price: number;
  tokenAmountCoin: number;
  tokenAmountLp: number;
  tokenAmountPc: number;
  volume7d: number;
  volume7dQuote: number;
  volume24h: number;
  volume24hQuote: number;
  volume30d: number;
  volume30dQuote: number;
}

const loadDefaultTokens = async (): Promise<RaydiumToken[]> => {
  const allTokens = await new TokenListProvider().resolve();
  const productionTokens = allTokens.filterByChainId(101).getList();

  return productionTokens.map<RaydiumToken>((token) => ({
    mint: token.address,
    decimals: token.decimals,
    icon: token.logoURI,
    name: token.name,
    symbol: token.symbol,
    extensions:
      token.extensions && token.extensions.coingeckoId
        ? { coingeckoId: token.extensions.coingeckoId }
        : {},
  }));
};

const loadTokens = async (): Promise<RaydiumToken[]> => {
  const res = await fetch(
    'https://api.raydium.io/v2/sdk/token/raydium.mainnet.json'
  );
  if (!res.ok) {
    return loadDefaultTokens();
  }
  const { official, unNamed, unOfficial } =
    (await res.json()) as RaydiumTokenResponse;

  return official.concat(unNamed).concat(unOfficial);
};

const loadRaydiumPaires = async (): Promise<{
  [key in string]: { usd: number };
}> => {
  const res = await fetch('https://api.raydium.io/v2/main/pairs');
  if (!res.ok) {
    return {};
  }

  const paires = (await res.json()) as RaydiumPair[];
  return paires.reduce((agg: { [key in string]: { usd: number } }, pair) => {
    const [from, to] = pair.name.split('-');
    if (to === 'USDC' || to === 'USDT') {
      agg[from] = { usd: pair.price };
    }
    return agg;
  }, {});
};

const loadCoingeckoPrices = async (
  ids: string[]
): Promise<{ [key in string]: { usd?: number } }> => {
  const joinedIds = ids.join(',');
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${joinedIds}&vs_currencies=usd&include_market_cap=true`;
  if (url.length > 4096) {
    const middle = Math.round(ids.length / 2);
    const firstHalf = await loadCoingeckoPrices(ids.slice(0, middle));
    const secondHalf = await loadCoingeckoPrices(ids.slice(middle));
    return Object.assign(firstHalf, secondHalf);
  } else {
    const res = await fetch(url);
    if (!res.ok) {
      return {};
    }
    return await res.json();
  }
};

const fullTokenPriceMap: Promise<TokenPriceMap> = loadTokens().then(
  async (tokens) => {
    const coingeckoIds: string[] = tokens.reduce((agg: string[], token) => {
      if (token.extensions?.coingeckoId) {
        agg.push(token.extensions.coingeckoId);
      }
      return agg;
    }, []);

    const [geckoPriceMap, raydiumPriceMap] = await Promise.all([
      loadCoingeckoPrices(Array.from(new Set(coingeckoIds))),
      loadRaydiumPaires(),
    ]);

    const tokenPrices = tokens.map((token) => {
      const geckoPrice = token.extensions?.coingeckoId
        ? geckoPriceMap[token.extensions?.coingeckoId]
        : undefined;
      if (geckoPrice && geckoPrice.usd) {
        return {
          mint: token.mint,
          usd: geckoPrice.usd,
          decimals: token.decimals,
          name: token.name,
          icon: token.icon,
          source: 'coingeckoId',
        };
      }
      const raydiumPrice = token.symbol
        ? raydiumPriceMap[token.symbol]
        : undefined;

      if (raydiumPrice) {
        return {
          mint: token.mint,
          usd: raydiumPrice.usd,
          decimals: token.decimals,
          name: token.name,
          icon: token.icon,
          source: 'raydium',
        };
      }

      return {
        mint: token.mint,
        usd: 0,
        decimals: token.decimals,
        name: token.name,
        icon: token.icon,
      };
    });

    return tokenPrices.reduce(
      (agg: TokenPriceMap, price) =>
        Object.assign(agg, { [price.mint]: price }),
      {}
    );
  }
);

const getPriceMap = async (mints: string[]): Promise<TokenPriceMap> => {
  const fullPriceMap = await fullTokenPriceMap;
  return mints.reduce((agg: TokenPriceMap, mint) => {
    if (fullPriceMap[mint]) {
      agg[mint] = fullPriceMap[mint];
    }
    return agg;
  }, {});
};

const getSolPrice = async (): Promise<number> => Promise.resolve(44.18);

export const PriceService = {
  getSolPrice,
  getPriceMap,
};
