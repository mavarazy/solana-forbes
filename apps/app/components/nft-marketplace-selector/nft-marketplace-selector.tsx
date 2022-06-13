import { NftMarketplace } from '@forbex-nxr/types';
import Link from 'next/link';
import { useMemo } from 'react';
import { classNames } from '../utils';

interface NftMarketplaceSelectorProps {
  marketplace: NftMarketplace;
  stats: Array<{ marketplace: string; count: BigInt }>;
}

export function NftMarketplaceSelector({
  marketplace,
  stats,
}: NftMarketplaceSelectorProps) {
  const tabs = useMemo(() => {
    const total = stats.reduce((sum, { count }) => sum + Number(count), 0);

    const tabs = stats
      .map(({ marketplace, count }) => ({ marketplace, count: Number(count) }))
      .concat({ marketplace: NftMarketplace.top, count: total });

    tabs.sort((a, b) => b.count - a.count);
    return tabs;
  }, [stats]);

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          defaultValue={
            tabs.find((tab) => tab.marketplace === marketplace).marketplace
          }
        >
          <option key="all">All</option>
          {tabs.map((tab) => (
            <option key={tab.marketplace}>{tab.marketplace}</option>
          ))}
        </select>
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
                      tab.marketplace === marketplace
                        ? 'border-brand text-brand'
                        : 'border-transparent text-gray-500 hover:text-brand hover:border-brand hover:b',
                      'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm'
                    )}
                    aria-current={
                      tab.marketplace === marketplace ? 'page' : undefined
                    }
                  >
                    {tab.marketplace}

                    <span
                      className={classNames(
                        tab.marketplace === marketplace
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
