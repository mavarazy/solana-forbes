import { faSpinner, faWallet } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PublicKey } from '@solana/web3.js';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ProgramIcon } from '../program-icon';
import { TokenTypeIcon } from '../token-type-icon';
import { classNames } from '../utils';
import LogoImg from './images/logo.png';

const NavigationLink = ({
  href,
  active,
  children,
}: {
  active: boolean;
  href: string;
  children;
}) => (
  <Link href={href} passHref>
    <a
      className={classNames(
        active ? 'border-white  border-b-2 font-bold' : 'font-base',
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
    await router.push(`/wallet/${form.search}`);
  };

  return (
    <nav className="bg-brand shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex px-2 lg:px-0">
            <div className="flex-shrink-0 flex items-center cursor-pointer">
              <Link href="/" passHref>
                <a>
                  <Image
                    className="block h-8 w-auto"
                    src={LogoImg}
                    alt="Workflow"
                    width={48}
                    height={48}
                  />
                </a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <div className="flex space-x-4">
                <NavigationLink href="/" active={router.asPath === '/'}>
                  Top
                </NavigationLink>
                <NavigationLink
                  href="/top/person"
                  active={router.asPath === '/top/person'}
                >
                  <>
                    <ProgramIcon program={false} />
                    <span className="ml-2">Person</span>
                  </>
                </NavigationLink>
                <NavigationLink
                  href="/top/machine"
                  active={router.asPath === '/top/machine'}
                >
                  <>
                    <ProgramIcon program />
                    <span className="ml-2">Machine</span>
                  </>
                </NavigationLink>
                <NavigationLink
                  href="/top/token"
                  active={router.asPath === '/top/token'}
                >
                  <>
                    <TokenTypeIcon
                      type="priced"
                      className="h-5 w-5 text-white shadow-xl rounded-full"
                    />
                    <span className="ml-2">Tokens</span>
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
                  <FontAwesomeIcon
                    icon={isSubmitting ? faSpinner : faWallet}
                    spin={isSubmitting}
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Search for account's worth"
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
