import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const usePutInstallmentApi = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async ({ id, data }) => {
      const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/fee-installments/${id}`;
      const res = await axios.put(
        url,
        { data }
        // { headers: { Authorization: `Bearer ${state.token}` } }
      );
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["use-get-students-api"]);
      },
    }
  );
  return mutation;
};

export default usePutInstallmentApi;
