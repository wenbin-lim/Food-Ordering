import { useQuery } from 'react-query';
import axios from 'axios';
import map from '../map';
import queryConfig from '../queryConfig';

export default function useGetAll(key) {
  const [queryKey, apiUrl] = map[key];

  return useQuery(
    queryKey,
    async () => {
      const res = await axios.get(apiUrl);
      return res.data;
    },
    queryConfig
  );
}
