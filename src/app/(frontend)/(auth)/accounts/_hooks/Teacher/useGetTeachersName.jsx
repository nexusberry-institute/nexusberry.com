import axios from "axios";
import { useQuery } from "react-query";

export default function useGetTeachersName() {
  const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/teachers`;

  const fetchApi = async () => {
    try {
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching teachers:", error.response.data);
      throw error;
    }
  };

  const { isLoading, error, data } = useQuery(["teachers", url], fetchApi);

  return {
    isLoading,
    error,
    data,
  };
}
