import { useQuery } from 'react-query';
import axios from 'axios';
import map from '../map';
import queryConfig from '../queryConfig';

export default function useGetAll(key, params = {}, enabled = true) {
  const [queryKey, apiUrl] = map[key];

  return useQuery(
    queryKey,
    async () => {
      const res = await axios.get(apiUrl, { params });
      return res.data;
    },
    {
      ...queryConfig,
      enabled,
    }
  );
}
