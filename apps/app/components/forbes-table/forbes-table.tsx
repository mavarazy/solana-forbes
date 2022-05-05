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
      <div className="flex flex-1 w-full text-sm font-medium max-w-6xl self-center p-2 bg-gray-200 rounded-t-xl">
        <div className="w-20 py-3 pl-4 text-left text-xs uppercase font-medium tracking-wide  flex items-center justify-start">
          #
        </div>
        <div className="px-2 flex flex-1 flex-col justify-center py-3 pl-4 pr-3 text-left text-xs uppercase">
          Wallet
        </div>
        <div className="px-4 w-48 flex flex-col justify-center py-3 pl-4 pr-3 text-left text-xs uppercase">
          Worth
        </div>
      </div>
      {wallets.map(({ id, worth, top }, i) => (
        <React.Fragment key={id}>
          <div
            className={classNames(
              i % 2 === 0 ? 'bg-gray-100' : 'bg-white',
              'flex flex-1 w-full text-sm font-medium max-w-6xl self-center p-2'
            )}
          >
            <div className="text-gray-900 w-20 px-2 flex items-center justify-start">
              {i + 1}
            </div>
            <div className="text-gray-900 px-2 flex flex-1 flex-col justify-center">
              <AddressLink address={id} />
            </div>
            <div className="px-4 text-gray-500 w-48 flex items-center">
              {worth.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            </div>
          </div>
          <div
            className={classNames(
              i % 2 === 0 ? 'bg-gray-100' : 'bg-white',
              'flex flex-1 w-full text-sm font-medium max-w-6xl self-center p-2 pl-20 justify-between'
            )}
          >
            {top.map(({ amount, usd, mint, info }) => (
              <div key={mint} className="flex flex-col border-2 p-2">
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
        </React.Fragment>
      ))}
    </div>
  );
}
