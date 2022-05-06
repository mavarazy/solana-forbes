import { NumberUtils, WalletBallance } from '@forbex-nxr/utils';
import { TokenInfo } from '@solana/spl-token-registry';
import React from 'react';
import { AddressLink } from '../address-link';
import Link from 'next/link';
import { TokenWelth } from '../token-worth-card';

interface ForbesTableProps {
  wallets: Array<
    Pick<WalletBallance, 'id' | 'worth' | 'sol' | 'top'> & { info: TokenInfo }
  >;
}

export function ForbesList({ wallets }: ForbesTableProps) {
  return (
    <div className="m-10">
      {wallets.map(({ id, worth, sol, top }, i) => (
        <div
          key={id}
          className="flex flex-col rounded-xl max-w-2xl self-center m-4 divide-y relative shadow-xl bg-white"
        >
          <div className="flex flex-1 flex-col my-8">
            <span className="absolute top-2 left-2 bg-green-600 font-bold px-4 py-0.5 rounded-full shadow-lg text-white">
              # {i + 1}
            </span>
            <span className="flex flex-1 text-xs absolute top-2 right-2">
              {sol.toLocaleString()} SOL
            </span>
            <Link href={`/wallet/${id}`} passHref>
              <div className="flex flex-col text-2xl self-center mt-2 font-bold text-gray-900 px-2 justify-center items-center hover:text-indigo-500 cursor-pointer">
                <span className="flex flex-1 justify-center">
                  <span>{NumberUtils.asHuman(worth)}</span>
                </span>
                <span className="flex text-xs font-bold">{id}</span>
              </div>
            </Link>
          </div>
          <div className="flex flex-1 items-center">
            {top
              .filter((token) => token.usd)
              .map((token) => (
                <TokenWelth key={token.mint} {...token} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
