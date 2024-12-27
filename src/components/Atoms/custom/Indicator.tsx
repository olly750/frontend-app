import React, { ReactNode } from 'react';

type IndicatorProps = {
  isCircular: boolean;
  className?: string;
  isActive?: boolean;
  hasError?: boolean;
  isComplete?: boolean;
  clicked: () => void;
  children: ReactNode;
};

const Indicator = ({
  isCircular,
  className = '',
  isActive,
  hasError,
  isComplete,
  clicked,
  children,
}: IndicatorProps) => {
  return (
    <>
      <button
        className={`relative justify-center items-center w-8 h-8 
        border text-sm text-center z-2
        ${className}
         ${
           isActive
             ? 'text-main bg-primary-600 border-primary-600'
             : isComplete
             ? 'text-main bg-primary-400 border-primary-400'
             : 'text-txt-secondary bg-silver border-silver font-semibold'
         }
         ${hasError ? 'bg-error-500 border-error-500' : ''}
         ${isCircular ? 'rounded-full' : 'rounded-lg'}`}
        onClick={() => clicked()}>
        {children}
      </button>
    </>
  );
};

export default Indicator;
