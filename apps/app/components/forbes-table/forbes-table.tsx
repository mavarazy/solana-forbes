import { WalletBalance } from '@solana-forbes/types';
import React from 'react';
import Link from 'next/link';
import { WalletWorthCard } from '../wallet-worth-card';

interface ForbesTableProps {
  wallets: Array<Omit<WalletBalance, 'tokens' | 'top'>>;
}

export function ForbesList({ wallets }: ForbesTableProps) {
  return (
    <div className="flex flex-1 m-2 sm:m-4 justify-center items-center">
      <div className="max-w-5xl flex flex-col flex-1">
        <div
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {wallets.map((wallet, i) => (
            <Link href={`/wallet/${wallet.id}`} passHref key={wallet.id}>
              <a>
                <WalletWorthCard rank={i + 1} wallet={wallet} />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
