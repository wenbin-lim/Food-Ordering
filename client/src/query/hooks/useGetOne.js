import { useQuery } from 'react-query';
import axios from 'axios';
import map from '../map';
import queryConfig from '../queryConfig';

export default function useGetOne(key, id) {
  const [queryKey, apiUrl] = map[key];

  return useQuery(
    id && [queryKey, id],
    async (key, id) => {
      const res = await axios.get(`${apiUrl}${id}`);
      return res.data;
    },
    queryConfig
  );
}
