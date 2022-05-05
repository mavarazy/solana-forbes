import { WalletBallance } from '../../context';
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

export function ForbesList({ wallets }: ForbesTableProps) {
  return (
    <div className="mt-2 flex flex-col flex-1 mb-10 justiry-center">
      {wallets.map(({ id, worth, top }, i) => (
        <div
          key={id}
          className="flex flex-col border-2 rounded-xl shadow-lg max-w-6xl self-center m-4 divide-y"
        >
          <div className="flex flex-1 flex-col my-8">
            <div className="flex text-2xl self-center mt-2 font-bold seld-start">
              {worth}
            </div>
            <div className="text-gray-900 px-2 flex text-2xl self-center">
              <AddressLink address={id} />
            </div>
          </div>
          <div className="flex flex-1 divide-x items-center">
            {top
              .filter((token) => token.usd)
              .map(({ amount, usd, mint, info }) => (
                <div
                  key={mint}
                  className="flex flex-col p-4 self-center mx-auto"
                >
                  <div className="w-48 flex flex-col justify-center text-center">
                    <AddressLink address={mint}>
                      {info && info.logoURI && (
                        <TokenLogo
                          logoURI={info.logoURI}
                          className="h-12 w-12 rounded-full flex flex-1 items-center mx-auto"
                        />
                      )}
                      <div className="flex justify-center">
                        <span className="text-xs font-semibold">
                          USD: {usd && usd.toPrecision(3)}
                        </span>
                      </div>
                      <span className="items-center font-semibold mt-2 text-center text-xl">
                        {info?.name}
                      </span>
                      <div className="flex justify-center">
                        <span>
                          {amount.toLocaleString()} {info?.symbol}
                        </span>
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
