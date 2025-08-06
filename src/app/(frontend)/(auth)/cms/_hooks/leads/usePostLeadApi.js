import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
// import { useAuth } from "~/context/AuthProvider";

const usePostLeadApi = () => {
  const queryClient = useQueryClient();
//   const { state } = useAuth();

  const mutation = useMutation(
    async (dataObj) => {
      console.log("dataObj", dataObj)
      const url = `${process.env.NEXT_PUBLIC_API_KEY}/leeds`;
      const res = await axios.post(
        url,
        { data: {...dataObj} },
        // { headers: { Authorization: `Bearer ${state.token}` } }
      );

      // console.log("res.data:",res.data)
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

export default usePostLeadApi;