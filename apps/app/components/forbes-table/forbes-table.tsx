import { useGlobalState } from '../../context';
import { List, ListRowProps, WindowScroller } from 'react-virtualized';
import { useCallback, useMemo } from 'react';
import { classNames } from '@forbex-nxr/utils';

const AddressLink = ({ address }: { address: string }) => (
  <a
    href={`https://explorer.solana.com/address/${address}`}
    target="_blank"
    className="hover:text-indigo-500"
    rel="noreferrer"
  >
    {address}
  </a>
);

export function ForbesTable() {
  const {
    state: { wallets },
  } = useGlobalState();

  const walletList = useMemo(() => Object.values(wallets), [wallets]);

  const renderItem = useCallback(
    (props: ListRowProps) => {
      const account = walletList[props.index];
      return (
        <div
          key={account.id}
          style={props.style}
          className={classNames(
            props.index % 2 === 0 ? 'bg-gray-100' : 'bg-white',
            'flex flex-1 w-full text-sm font-medium max-w-6xl self-center'
          )}
        >
          <div className="text-gray-900 w-20 px-2 flex items-center justify-start">
            {props.index + 1}
          </div>
          <div className="text-gray-900 px-2 flex flex-1 flex-col justify-center">
            <AddressLink address={account.id} />
          </div>
          <div className="px-4 text-gray-500 w-48 flex items-center">
            {account.worth.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </div>
        </div>
      );
    },
    [walletList]
  );

  return (
    <div className="mt-2 flex flex-col flex-1 mb-10 justiry-center">
      <div className="bg-gray-50 flex text-xl rounded-t-lg text-gray-500 max-w-6xl">
        <div className="w-20 py-3 pl-4 text-left text-xs uppercase font-medium tracking-wide  flex items-center justify-start">
          #
        </div>
        <div className="px-2 flex flex-1 flex-col justify-center py-3 pl-4 pr-3 text-left text-xs uppercase">
          Wallet
        </div>
        <div className="px-4 w-24 flex items-center py-3 pl-4 pr-3 text-left text-xs uppercase">
          Drop
        </div>
        <div className="px-4 w-48 flex flex-col justify-center py-3 pl-4 pr-3 text-left text-xs uppercase">
          Balance
        </div>
      </div>
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop, width }) => (
          <List
            autoHeight
            height={height}
            isScrolling={isScrolling}
            onScroll={onChildScroll}
            scrollTop={scrollTop}
            rowCount={walletList.length}
            rowRenderer={renderItem}
            rowHeight={48}
            autoWidth
            width={width}
          />
        )}
      </WindowScroller>
    </div>
  );
}
