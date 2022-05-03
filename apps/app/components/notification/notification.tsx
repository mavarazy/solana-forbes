/* This example requires Tailwind CSS v2.0+ */
import {
  ForwardedRef,
  forwardRef,
  Fragment,
  useImperativeHandle,
  useState,
} from "react";
import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/pro-light-svg-icons";

const errorToMessage = (error: unknown) => {
  if (error instanceof Error) {
    if (error.message.includes("429")) {
      return "Try again later! Network is busy";
    } else {
      return error.message;
    }
  }
  return "Captian Obvious: Something went wrong";
};

export interface NotificationProps {
  error(error: unknown): void;
}

export const Notification = forwardRef(
  (_: any, ref: ForwardedRef<NotificationProps>) => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");

    useImperativeHandle(ref, () => ({
      error: (error: unknown) => {
        setMessage(errorToMessage(error));
        setShow(true);
      },
    }));

    return (
      <>
        <div
          aria-live="assertive"
          className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-10"
        >
          <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
            <Transition
              show={show}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden z-20">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <FontAwesomeIcon
                        icon={faExclamationCircle}
                        className="h-6 w-6 text-red-500"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">
                        Error!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                          setShow(false);
                        }}
                      >
                        <span className="sr-only">Close</span>
                        <XIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </>
    );
  }
);

Notification.displayName = "Notification";
