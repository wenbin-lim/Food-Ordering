import { useMutation, queryCache } from 'react-query';
import axios from 'axios';

/* 
  options = {
    route: api url string,
*/
export default function usePut(key, options = {}) {
  const { route } = options;

  return useMutation(
    async variables => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify(variables);

      const res = await axios.put(route, body, config);
      return res.data;
    },
    {
      onSuccess: () => queryCache.refetchQueries(key),
    }
  );
}
