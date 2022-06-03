import { faArrowRotateRight, faAt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from '../../context';
import { useForm } from 'react-hook-form';

interface SubscriptionForm {
  email: string;
}

export const SubscriptionForm = () => {
  const { onError } = useGlobalState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionForm>();

  const handleSubscibe = async (form: SubscriptionForm) => {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    if (res.ok) {
      reset();
      return;
    }
    onError('Failed to submit request');
  };

  return (
    <footer className="bg-white">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 className="inline text-3xl font-extrabold tracking-tight text-gray-900 sm:block sm:text-4xl">
          Want Solana weekly trends?
        </h2>
        <p className="inline text-3xl font-extrabold tracking-tight text-brand sm:block sm:text-4xl">
          Sign up for our newsletter.
        </p>
        <form className="mt-8 sm:flex" onSubmit={handleSubmit(handleSubscibe)}>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-5 py-3 placeholder-gray-500 focus:ring-brand focus:border-brand sm:max-w-xs border-brand rounded-md border"
            placeholder="Enter your email"
            {...register('email', { required: true })}
          />
          {errors && errors.email && (
            <div className="absolute bg-red-500 m-1 shadow-md flex z-20 rounded-full text-white text-xs">
              <span className="px-4 py-1 font-bold">
                {errors.email.message ?? 'Something is wrong'}
              </span>
            </div>
          )}
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-drand"
              disabled={isSubmitting}
            >
              <FontAwesomeIcon
                icon={isSubmitting ? faArrowRotateRight : faAt}
                spin={isSubmitting}
                className="mr-2"
              />
              Notify me
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
};
