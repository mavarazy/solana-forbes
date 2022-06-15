import Link from 'next/link';
import { useRouter } from 'next/router';
import { ProgramIcon } from '../program-icon';
import { classNames } from '../utils';
import { WalletIcon } from '../wallet-icon';

interface WalletNav {
  selected: 'all' | 'machine' | 'person';
}

const tabs = [
  {
    href: '/wallet/all',
    name: 'All',
    icon: <WalletIcon isSubmitting={false} />,
  },
  {
    href: '/wallet/person',
    name: 'Personal',
    icon: <ProgramIcon program={false} />,
  },
  {
    href: '/wallet/machine',
    name: 'Programs',
    icon: <ProgramIcon program />,
  },
];

export function WalletNav({ selected }: WalletNav) {
  const router = useRouter();

  return (
    <div className="flex justify-center">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map(({ href, name, icon }) => {
          return (
            <Link href={href} passHref key={name}>
              <a
                className={classNames(
                  router.asPath.startsWith(href)
                    ? 'border-brand text-brand'
                    : 'border-transparent text-gray-500 hover:text-brand hover:border-brand hover:b',
                  'whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm'
                )}
                aria-current={name === selected ? 'page' : undefined}
              >
                <span className="flex self-center mr-2">{icon}</span>
                <span className="text-bold">{name}</span>
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
