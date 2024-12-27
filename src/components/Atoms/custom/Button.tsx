import '../../../styles/components/Atoms/custom/button.scss';

import React, { ButtonHTMLAttributes, DOMAttributes, ReactNode } from 'react';

import { bgStyleButton, colorStyle } from '../../../global/global-vars';
import { Color, TextDecoration } from '../../../types';

type ButtonType = 'fill' | 'outline' | 'text';
type ButtonStyleType = {
  // eslint-disable-next-line no-unused-vars
  [index in ButtonType]: string;
};

interface PropTypes<T> extends ButtonHTMLAttributes<DOMAttributes<T>> {
  children: ReactNode;
  disabled?: boolean;
  full?: boolean;
  icon?: boolean;
  styleType?: ButtonType;
  color?: Color;
  hoverStyle?: TextDecoration;
  className?: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export default function Button<T>({
  children,
  disabled,
  styleType = 'fill',
  color = 'primary',
  full,
  icon,
  className = '',
  hoverStyle = 'underline',
  onClick,
  isLoading,
  ...attrs
}: PropTypes<T>) {
  const buttonStyle: ButtonStyleType = {
    fill: ` ${!icon && 'with-width'}   border-2 border-solid border-${
      colorStyle[color]
    } ${bgStyleButton[color]} text-main`,
    outline: ` ${!icon && 'with-width'}  border-2 border-solid border-${
      colorStyle[color]
    } text-${colorStyle[color]}`,
    text: `text-${colorStyle[color]} hover:${hoverStyle}`,
  };

  // determine padding based on the style type of button
  const padding = icon ? '' : full ? 'py-3' : 'py-3 px-4';

  return (
    <button
      {...attrs}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${
        buttonStyle[styleType]
      } rounded-lg font-semibold text-sm outline-none transition ease-in-out 
      ${full && 'w-full'}
      ${padding} ${className}
      disabled:opacity-50`}>
      <span className="flex w-full space-x-2 transition justify-center ease-in-out">
        {isLoading && (
          <span className="animate-spin ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24">
              <path fill="none" d="M0 0h24v24H0z" />
              <path
                className="fill-current"
                d="M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z"
              />
            </svg>
          </span>
        )}
        <span className="flex items-center text-center justify-center">{children}</span>
      </span>
    </button>
  );
}
