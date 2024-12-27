import { useEffect, useState } from 'react';

export default function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<'YES' | 'NO' | undefined>(undefined);

  const handleNetworkChange = () => {
    setIsOnline(navigator.onLine ? 'YES' : 'NO');
  };

  useEffect(() => {
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  return { isOnline };
}
