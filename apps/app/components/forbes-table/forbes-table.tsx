import { WalletBalance } from '@forbex-nxr/types';
import React from 'react';
import Link from 'next/link';
import { WorthCard } from '../worth-card';

interface ForbesTableProps {
  wallets: Array<Omit<WalletBalance, 'tokens' | 'top'>>;
}

export function ForbesList({ wallets }: ForbesTableProps) {
  return (
    <>
      {wallets.map((wallet, i) => (
        <Link href={`/top/${wallet.id}`} passHref key={wallet.id}>
          <a className="flex flex-1 m-2 sm:m-4 justify-center items-center">
            <div className="flex flex-1 max-w-3xl">
              <WorthCard rank={i + 1} wallet={wallet} />
            </div>
          </a>
        </Link>
      ))}
    </>
  );
}
