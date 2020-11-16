import { useMutation, queryCache } from 'react-query';
import axios from 'axios';
import map from '../map';

export default function useDeleteOne(key) {
  const [queryKey, apiUrl] = map[key];

  return useMutation(
    async id => {
      const res = await axios.delete(`${apiUrl}/${id}`);
      return res.data;
    },
    {
      onSuccess: () => queryCache.refetchQueries(queryKey),
    }
  );
}
