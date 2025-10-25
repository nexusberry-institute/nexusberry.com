import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const usePutLeadApi = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation(
    async ({id, data}) => {
      const url = `${process.env.NEXT_PUBLIC_API_KEY}/leeds/${id}`;
      const res = await axios.put(
        url,
        { data },
      );
    return res.data;
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries(["use-get-leads-api"]);
    },
  }
  );
  
  return mutation;
};

export default usePutLeadApi;