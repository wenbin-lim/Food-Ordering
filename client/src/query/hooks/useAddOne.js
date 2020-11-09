import { useMutation, queryCache } from 'react-query';
import axios from 'axios';
import map from '../map';

export default function useAddOne(key) {
  const [queryKey, apiUrl] = map[key];

  return useMutation(
    async newItem => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify(newItem);
      const res = await axios.post(apiUrl, body, config);

      return res.data;
    },
    {
      onSuccess: () => queryCache.refetchQueries(queryKey),
    }
  );
}
