import { NumberUtils, WalletBallance } from '@forbex-nxr/utils';
import { TokenInfo } from '@solana/spl-token-registry';
import React from 'react';
import { TokenWorthCard } from '../token-worth-card';
import Link from 'next/link';
import { SummaryBadge } from '../summary-badge';
import { SolBadge } from '../sol-badge';
import { WorthCard } from '../worth-card';

interface ForbesTableProps {
  wallets: Array<Omit<WalletBallance, 'tokens'> & { info: TokenInfo }>;
}

export function ForbesList({ wallets }: ForbesTableProps) {
  return (
    <div className="m-10 p-10">
      {wallets.map((wallet, i) => (
        <div
          key={wallet.id}
          className="flex flex-col rounded-xl max-w-6xl self-center m-4 relative shadow-xl bg-white p-10 gap-10"
        >
          <div className="flex flex-1">
            <Link href={`wallet/${wallet.id}`} passHref>
              <WorthCard rank={i + 1} wallet={wallet} />
            </Link>
          </div>
          <div className="flex flex-1 items-center gap-4">
            {wallet.top.map((token) => (
              <TokenWorthCard key={token.mint} {...token} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
