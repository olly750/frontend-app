import { useContext } from 'react';

import UserContext from '../context/UserContext';

export function usePrimaryColor() {
  const { theme } = useContext(UserContext);

  switch (theme) {
    case 'MILITARY_GREEN':
      return '#094927';
    case 'NISS_GREEN':
      return '#105E55';
    case 'POLICE_DARK_BLUE':
      return '#01013e';
    case 'RCS_TAN':
      return '#948b6e';
    default:
      return '#394bd1';
  }
}

export function getPrimaryColor() {
  const theme = localStorage.getItem('theme') || 'DEFAULT';
  // MILITARY_GREEN: 'MILITARY-theme',

  switch (theme) {
    case 'MILITARY_GREEN':
      return '#094927';
    case 'NISS_GREEN':
      return '#105E55';
    case 'POLICE_DARK_BLUE':
      return '#01013e';
    case 'RCS_TAN':
      return '#948b6e';
    default:
      return '#394bd1';
  }
}
