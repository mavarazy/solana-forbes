import { NumberUtils, WalletBallance } from '@forbex-nxr/utils';
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
    rel="noreferrer"
  >
    {children || address}
  </a>
);

interface ForbesTableProps {
  wallets: Array<Pick<WalletBallance, 'id' | 'worth' | 'top'>>;
}

export function ForbesList({ wallets }: ForbesTableProps) {
  return (
    <div className="mt-2 flex flex-col flex-1 mb-10 justiry-center">
      {wallets.map(({ id, worth, top }, i) => (
        <div
          key={id}
          className="flex flex-col rounded-xl max-w-6xl self-center m-4 divide-y relative shadow-xl bg-white"
        >
          <div className="flex flex-1 flex-col my-8">
            <span className="absolute top-2 left-2 bg-green-600 font-bold px-4 py-0.5 rounded-full shadow-lg text-white">
              # {i + 1}
            </span>
            <div className="flex text-2xl self-center mt-2 font-bold">
              <div className="text-gray-900 px-2 flex text-2xl self-center justify-center items-center hover:text-indigo-500">
                <AddressLink address={id}>
                  <span className="flex flex-1 justify-center">
                    <span>{NumberUtils.asHuman(worth)}</span>
                  </span>
                  <span className="flex text-xs font-bold">{id}</span>
                </AddressLink>
              </div>
            </div>
          </div>
          <div className="flex flex-1 divide-x items-center">
            {top
              .filter((token) => token.usd)
              .map(({ amount, usd, mint, info, percent }) => (
                <div
                  key={mint}
                  className="flex flex-col p-4 self-center mx-auto hover:text-indigo-500"
                >
                  <div className="w-48 flex flex-col justify-center text-center relative ">
                    <AddressLink address={mint}>
                      {info && info.logoURI && (
                        <TokenLogo
                          logoURI={info.logoURI}
                          className="h-12 w-12 rounded-full flex flex-1 items-center mx-auto"
                        />
                      )}
                      {percent > 1 && (
                        <span className="absolute top-0 right-0 text-xs font-bold bg-gray-500 px-2 py-0.5 rounded-full text-white shadow-lg">
                          {percent.toFixed(1)} %
                        </span>
                      )}
                      <div className="flex justify-center">
                        <span className="text-xs font-semibold">
                          USD: {usd && usd}
                        </span>
                      </div>
                      <span className="items-center font-semibold mt-2 text-xl">
                        {info?.name}
                      </span>
                      <div className="flex justify-center">
                        <span>{NumberUtils.asHuman(amount)}</span>
                      </div>
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
