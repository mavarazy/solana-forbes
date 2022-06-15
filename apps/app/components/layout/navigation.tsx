import { PublicKey } from '@solana/web3.js';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { InfoIcon } from '../info-icon';
import { TokenTypeIcon } from '../token-type-icon';
import { classNames } from '../utils';
import { WalletIcon } from '../wallet-icon';

const NavigationLink = ({
  href,
  active,
  mobile = false,
  children,
}: {
  active: boolean;
  href: string;
  mobile?: boolean;
  children;
}) => (
  <Link href={href} passHref>
    <a
      className={classNames(
        active
          ? mobile
            ? 'border-white border-l-4 font-bold'
            : 'border-white  border-b-4 font-bold'
          : 'font-base',
        'text-white inline-flex items-center px-1 pt-1 text-sm'
      )}
      aria-current="page"
    >
      {children}
    </a>
  </Link>
);

interface SearchForm {
  search: string;
}

export function Navigation() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SearchForm>();

  const router = useRouter();

  const onSubmit = async (form: SearchForm) => {
    await router.push(`/wallet/check/${form.search}`);
  };

  return (
    <nav className="bg-brand shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between sm:h-16 h-32 flex-col-reverse sm:flex-row">
          <div className="flex px-2 lg:px-0">
            <div className="flex h-16 sm:ml-6 sm:space-x-8">
              <div className="flex space-x-4">
                <NavigationLink
                  href="/wallet/all"
                  active={router.asPath.startsWith('/wallet')}
                >
                  <>
                    <WalletIcon
                      isSubmitting={isSubmitting}
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                    <span className="ml-2 hidden sm:block">Wallets</span>
                  </>
                </NavigationLink>
                <NavigationLink
                  href="/token/all"
                  active={router.asPath.startsWith('/token')}
                >
                  <>
                    <TokenTypeIcon type="priced" className="h-5 w-5" />
                    <span className="ml-2 hidden sm:block">Tokens</span>
                  </>
                </NavigationLink>
                <NavigationLink
                  href="/nft/all/0"
                  active={router.asPath.startsWith('/nft')}
                >
                  <>
                    <TokenTypeIcon type="nfts" className="h-5 w-5 " />
                    <span className="ml-2 hidden sm:block">NFTs</span>
                  </>
                </NavigationLink>
                <NavigationLink
                  href="/about"
                  active={router.asPath === '/about'}
                >
                  <>
                    <InfoIcon className="h-5 w-5 text-white shadow-xl rounded-full" />
                    <span className="ml-2 hidden sm:block">About</span>
                  </>
                </NavigationLink>
              </div>
            </div>
            <div className="hidden lg:ml-6 lg:flex lg:space-x-8"></div>
          </div>
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full">
              <label htmlFor="search" className="sr-only">
                Wallet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <WalletIcon
                    isSubmitting={isSubmitting}
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Feed me address"
                    type="search"
                    onReset={() => reset()}
                    {...register('search', {
                      required: true,
                      validate: {
                        key: (key: string) => {
                          try {
                            new PublicKey(key);
                            return true;
                          } catch (err) {
                            return false;
                          }
                        },
                      },
                    })}
                  />
                  {errors && errors.search && (
                    <div className="absolute bg-red-500 m-1 shadow-md flex z-20 rounded-full text-white text-xs">
                      <span className="px-4 py-1 font-bold">Invalid key</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
