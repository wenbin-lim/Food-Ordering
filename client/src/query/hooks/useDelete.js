import { useMutation, queryCache } from 'react-query';
import axios from 'axios';

/* 
  options = {
    route: api url string,
*/
export default function useDeleteOne(key, options = {}) {
  const { route } = options;

  return useMutation(
    async () => {
      const res = await axios.delete(route);
      return res.data;
    },
    {
      onSuccess: () => queryCache.refetchQueries(key),
    }
  );
}
