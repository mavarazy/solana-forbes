import { CoinGeckoAPI } from '@coingecko/cg-api-ts';
import { RawAccount } from '@solana/spl-token';
import { TokenInfo } from '@solana/spl-token-registry';
import { PriceMap, TokenWorth } from './types';
import { throttle } from './throttle';
import { USDPriceMap } from './usd-price-map';

const getPrice = async (coingeckoId: string): Promise<number | null> => {
  const cg = new CoinGeckoAPI(window.fetch.bind(window));

  try {
    const {
      data: {
        market_data: {
          current_price: { usd },
        },
      },
    } = await cg.getCoinsId(coingeckoId);
    return usd;
  } catch (err) {
    console.error(`Failed to fetch ${coingeckoId}`);
  }
  return null;
};

const loadPriceMap = async (tokens: TokenInfo[]): Promise<PriceMap> => {
  const tokenPricePairs: Array<{
    token: TokenInfo;
    price: number | null;
  }> = await throttle(
    tokens.map((token) => async () => {
      const price = await PriceService.getPrice(token.extensions?.coingeckoId!);
      return { token, price };
    }),
    2,
    1
  );
  return tokenPricePairs.reduce((priceMap: PriceMap, { token, price }) => {
    if (price) {
      priceMap[token.address] = { usd: price, decimals: token.decimals };
    }
    return priceMap;
  }, {});
};

const getSolPrice = () =>
  USDPriceMap['So11111111111111111111111111111111111111112'];

const getSolWorth = (sol: bigint) => {
  const { usd, decimals } =
    USDPriceMap['So11111111111111111111111111111111111111112'];
  return usd * (Number(sol) / Math.pow(10, decimals));
};

const getTokenWorth = async (account: RawAccount): Promise<TokenWorth> => {
  const mint = account.mint.toString();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore We are checking later
  const price = USDPriceMap[mint];
  if (price) {
    const amount = Number(account.amount) / Math.pow(10, price.decimals);
    const worth = price.usd * amount;
    return {
      mint,
      amount,
      worth,
      usd: price.usd,
    };
  } else {
    return {
      mint,
      amount: Number(account.amount),
      worth: 0,
    };
  }
};

export const PriceService = {
  getPrice,
  getSolPrice,
  getSolWorth,
  getTokenWorth,
  loadPriceMap,
};
