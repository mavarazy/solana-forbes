import { WalletBallance } from '../../context';
import { classNames } from '@forbex-nxr/utils';
import React from 'react';
import { TokenLogo } from '../token-logo';

const AddressLink = ({
  address,
  children,
}: {
  address: string;
  children?: React.ReactNode;
}) => (
  <a
    href={`https://explorer.solana.com/address/${address}`}
    target="_blank"
    className="hover:text-indigo-500"
    rel="noreferrer"
  >
    {children || address}
  </a>
);

interface ForbesTableProps {
  wallets: Array<Pick<WalletBallance, 'id' | 'worth' | 'top'>>;
}

export function ForbesTable({ wallets }: ForbesTableProps) {
  return (
    <div className="mt-2 flex flex-col flex-1 mb-10 justiry-center">
      {wallets.map(({ id, worth, top }, i) => (
        <div
          key={id}
          className="flex border-2 rounded-xl shadow-lg max-w-6xl self-center m-4"
        >
          <div className="flex flex-1 flex-col">
            <div className="text-gray-900 px-2 flex flex-1 flex-col justify-center">
              <AddressLink address={id} />
            </div>
            <div className="flex items-center">
              {worth.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </div>
          </div>
          <div className="flex flex-1">
            {top.map(({ amount, usd, mint, info }) => (
              <div key={mint} className="flex flex-col border-2 p-4">
                <div className="w-48 flex flex-col border-2 justify-center">
                  <AddressLink address={mint}>
                    {info && info.logoURI && (
                      <TokenLogo
                        logoURI={info.logoURI}
                        className="h-12 w-12 rounded-full border-2 flex flex-1 items-center mx-auto"
                      />
                    )}
                    <span className="flex flex-1 border-2 items-center">
                      {info?.name}
                    </span>
                    <span className="flex flex-1 border-2">
                      {amount.toLocaleString()} {info?.symbol}
                    </span>
                    <span className="flex flex-1 border-2">
                      USD: {usd && usd.toFixed(3)}
                    </span>
                  </AddressLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
