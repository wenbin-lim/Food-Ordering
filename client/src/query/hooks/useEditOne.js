import { useMutation, queryCache } from 'react-query';
import axios from 'axios';
import map from '../map';

export default function useEditOne(key) {
  const [queryKey, apiUrl] = map[key];

  return useMutation(
    async ({ id, newItem }) => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify(newItem);

      const res = await axios.put(`${apiUrl}/${id}`, body, config);
      return res.data;
    },
    {
      onSuccess: () => queryCache.refetchQueries(queryKey),
    }
  );
}
