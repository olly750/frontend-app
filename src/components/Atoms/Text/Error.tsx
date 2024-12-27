import React, { ReactNode } from 'react';

export default function Error({ children }: { children: ReactNode }) {
  return <span className={`text-sm text-error-500`}>{children}</span>;
}
