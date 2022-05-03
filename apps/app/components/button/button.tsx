import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faArrowRotateRight } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { classNames } from '@forbex-nxr/utils';

interface ButtonProps {
  text?: string;
  icon?: IconDefinition;
  disabled?: boolean;
  children?: JSX.Element;
  onClick(): Promise<any>;
}

export const Button: React.FC<ButtonProps> = ({
  icon,
  text,
  disabled,
  children,
  onClick,
}) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    if (loading || disabled) {
      return;
    }
    try {
      setLoading(true);
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={classNames(
        loading
          ? 'bg-indigo-50 text-indigo-600 translate-y-1'
          : 'bg-indigo-600 text-white',
        disabled
          ? 'opacity-50 cursor-default -z-10'
          : 'hover:bg-indigo-50 hover:text-indigo-600 hover:translate-y-1 transition duration-50 ease-in-out',
        'font-mono text-[9px] px-2 py-2 rounded-full shadow-lg uppercase cursor-pointer'
      )}
      disabled={disabled}
      onClick={handleClick}
    >
      {icon && (
        <FontAwesomeIcon
          icon={loading ? faArrowRotateRight : icon}
          className={classNames(text ? 'mx-2' : '', 'h-4 w-4')}
          spin={loading}
        />
      )}
      {text && (
        <span className={classNames(icon ? 'mr-2' : 'mx-2', 'my-auto')}>
          {text}
        </span>
      )}
      {children}
    </button>
  );
};
