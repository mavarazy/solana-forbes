import { faSpinner, faWallet } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PublicKey } from '@solana/web3.js';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import LogoImg from './images/logo.png';

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
