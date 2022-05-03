import { TokenListProvider } from "@solana/spl-token-registry";
import { throttle } from "./throttle";
import { TokenService } from "./token-service";

const loadLatest = async () => {
  const resolvedTokens = await new TokenListProvider().resolve();
  const tokens = resolvedTokens
    .filterByClusterSlug("mainnet-beta")
    .getList()
    .filter((token) => token.extensions?.coingeckoId);

  tokens.sort((a, b) => a.name.localeCompare(b.name));

  const tasks = tokens.map((token) => async () => {
    console.log("Switching to ", token.name);
    return await TokenService.getLargestWallets(token.address);
  });

  throttle(tasks, 0.5, 1);
};

loadLatest();
