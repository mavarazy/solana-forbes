import { NftMarketplace } from '@solana-forbes/types';
import Link from 'next/link';
import { useMemo } from 'react';
import { classNames } from '../utils';

interface NftMarketplaceSelectorProps {
  selected: NftMarketplace;
  stats: Array<{ marketplace: string; count: bigint }>;
}

export function NftMarketplaceSelector({
  selected,
  stats,
}: NftMarketplaceSelectorProps) {
  const tabs = useMemo(() => {
    const total = stats.reduce((sum, { count }) => sum + Number(count), 0);

    const tabs = stats
      .map(({ marketplace, count }) => ({ marketplace, count: Number(count) }))
      .concat({ marketplace: NftMarketplace.all, count: total });

    tabs.sort((a, b) => b.count - a.count);
    return tabs;
  }, [stats]);

  return (
    <div>
      <div className="sm:hidden">
        <div className="flex justify-center my-4">
          <div className="flex flex-wrap justify-center max-w-4xl">
            {tabs.map(({ marketplace, count }) => (
              <Link href={`/nft/${marketplace}/0`} key={marketplace}>
                <span
                  key={marketplace}
                  className={classNames(
                    selected === marketplace
                      ? 'bg-green-500 shadow-lg text-white'
                      : 'bg-white',
                    'px-2 py-0.5 text-xs uppercase font-bold rounded-full border border-green text-md mx-1 my-1.5 cursor-pointer flex'
                  )}
                >
                  <span className="flex items-center">
                    {marketplace} | {count}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="flex justify-center">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              return (
                <Link
                  href={`/nft/${tab.marketplace}/0`}
                  passHref
                  key={tab.marketplace}
                >
                  <a
                    key={tab.marketplace}
                    className={classNames(
                      tab.marketplace === selected
                        ? 'border-brand text-brand'
                        : 'border-transparent text-gray-500 hover:text-brand hover:border-brand hover:b',
                      'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm'
                    )}
                    aria-current={
                      tab.marketplace === selected ? 'page' : undefined
                    }
                  >
                    {tab.marketplace}

                    <span
                      className={classNames(
                        tab.marketplace === selected
                          ? 'bg-brand text-white'
                          : '',
                        'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block'
                      )}
                    >
                      {Number(tab.count)}
                    </span>
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
