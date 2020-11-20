import { useQuery } from 'react-query';
import axios from 'axios';
import queryConfig from '../queryConfig';

/* 
  options = {
    route: api url string,
    params: params object to pass in axios.get
    enabled: useQuery enabled
    config: {
      cacheTime,
      enabled,
      initialData,
      initialStale,
      placeholderData,
      isDataEqual,
      keepPreviousData,
      notifyOnStatusChange,
      onError,
      onSettled,
      onSuccess,
      queryFnParamsFilter,
      queryKeySerializerFn,
      refetchInterval,
      refetchIntervalInBackground,
      refetchOnMount,
      refetchOnReconnect,
      refetchOnWindowFocus,
      retry,
      retryDelay,
      staleTime,
      structuralSharing,
      suspense,
      useErrorBoundary,
    }
  }
*/
export default function useGet(key, options = {}) {
  const { route, params, enabled, config, refetchInterval } = options;

  return useQuery(
    route && key,
    async () => {
      const res = await axios.get(route, { params });

      return res.data;
    },
    {
      ...queryConfig,
      enabled: typeof enabled === 'undefined' ? true : enabled,
      refetchInterval:
        typeof refetchInterval === 'number' ? refetchInterval : false,
      ...config,
    }
  );
}
