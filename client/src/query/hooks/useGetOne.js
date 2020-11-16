import { useQuery } from 'react-query';
import axios from 'axios';
import map from '../map';
import queryConfig from '../queryConfig';

export default function useGetOne(key, id, params = {}, enabled = true) {
  const [queryKey, apiUrl] = map[key];

  return useQuery(
    id && [queryKey, id],
    async (key, id) => {
      const res = await axios.get(`${apiUrl}/${id}`, { params });
      return res.data;
    },
    {
      ...queryConfig,
      enabled,
    }
  );
}
