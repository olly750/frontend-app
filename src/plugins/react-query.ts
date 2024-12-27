import { QueryClient } from 'react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3, // 5 minutes
      // retry: 0,
    },
  },
});
