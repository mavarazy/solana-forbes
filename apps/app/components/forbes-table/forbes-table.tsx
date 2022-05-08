import { NumberUtils, WalletBallance } from '@forbex-nxr/utils';
import { faHexagonVerticalNftSlanted } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TokenInfo } from '@solana/spl-token-registry';
import React from 'react';
import { TokenWorthCard } from '../token-worth-card';
import Link from 'next/link';

interface ForbesTableProps {
  wallets: Array<Omit<WalletBallance, 'tokens'> & { info: TokenInfo }>;
}

export function ForbesList({ wallets }: ForbesTableProps) {
  return (
    <div className="m-10">
      {wallets.map(({ id, worth, sol, nfts, top }, i) => (
        <div
          key={id}
          className="flex flex-col rounded-xl max-w-6xl self-center m-4 divide-y relative shadow-xl bg-white"
        >
          <div className="flex flex-1 flex-col my-8">
            <span className="absolute top-2 left-2 bg-green-600 font-bold px-4 py-0.5 rounded-full shadow-lg text-white">
              # {i + 1}
            </span>
            <span className="flex flex-1 flex-col text-xs absolute top-2 right-2">
              <div className="self-end">
                <span className="flex border rounded-full px-2 py-0.5 shadow-lg bg-green-600 text-white font-bold">
                  {sol.toLocaleString()} SOL
                </span>
              </div>
              {nfts > 0 && (
                <div className="self-end mt-1">
                  <span className="flex justify-center border rounded-full px-2 py-0.5 bg-gray-500 text-white font-semibold">
                    <FontAwesomeIcon
                      icon={faHexagonVerticalNftSlanted}
                      className="flex self-center"
                    />
                    <span className="self-center ml-1">
                      {nfts.toLocaleString()}
                    </span>
                  </span>
                </div>
              )}
            </span>
            <Link href={`wallet/${id}`} passHref>
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
                <TokenWorthCard key={token.mint} {...token} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
