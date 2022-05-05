import { throttle, TokenService } from '@forbex-nxr/utils';
import { TokenListProvider } from '@solana/spl-token-registry';

export const loadLatest = async () => {
  const resolvedTokens = await new TokenListProvider().resolve();
  const tokens = resolvedTokens.filterByClusterSlug('mainnet-beta').getList();

  tokens.sort((a, b) => a.name.localeCompare(b.name));

  const tasks = tokens.map((token, i) => async () => {
    console.log('Switching to ', i, ' ', token.name);
    return await TokenService.getLargestWallets(token.address);
  });

  throttle(tasks, 0.5, 1);
};
