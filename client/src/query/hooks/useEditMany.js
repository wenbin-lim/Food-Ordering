import { useMutation, queryCache } from 'react-query';
import axios from 'axios';
import map from '../map';

export default function useEditMany(key) {
  const [queryKey, apiUrl] = map[key];

  return useMutation(
    async body => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const stringifiedBody = JSON.stringify(body);

      const res = await axios.put(apiUrl, stringifiedBody, config);
      return res.data;
    },
    {
      onSuccess: () => queryCache.refetchQueries(queryKey),
    }
  );
}
