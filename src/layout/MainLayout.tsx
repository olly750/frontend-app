import React, { ReactNode, useContext } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import Fireworks from '../components/Atoms/custom/Fireworks';
import ToasterMolecule from '../components/Molecules/ToasterMolecule';
import UserContext from '../context/UserContext';
import { queryClient } from '../plugins/react-query';
import { themeConfig } from '../types/services/institution.types';

interface PropType {
  children: ReactNode;
}
export function MainLayout({ children }: PropType) {
  const { theme } = useContext(UserContext);

  return (
    <div className={`${themeConfig[theme]}`}>
      <QueryClientProvider client={queryClient}>
        <Fireworks />
        <ToasterMolecule />
        <ReactQueryDevtools initialIsOpen={false} />
        {children}
      </QueryClientProvider>
    </div>
  );
}
