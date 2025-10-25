import axios from "axios";
import { useQuery } from "react-query";
import * as qs from "qs-esm";

export default function useGetExpensesApi(
  selectedType,
  selectedMonth,
  searchedYear
) {
  const query = qs.stringify({
    filters: {
      type: {
        $eq: selectedType === "all" ? undefined : selectedType,
      },
      month: {
        $eq: selectedMonth === "all" ? undefined : selectedMonth,
      },
      year: {
        $eq: searchedYear === "" ? undefined : searchedYear,
      },
    },

    sort: {
      id: "desc",
    },

    pagination: {
      pageSize: 30,
    },

    encodeValuesOnly: true,
  });

  const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/expenses?${query}`;

  const fetchApi = async () => {
    try {
      const response = await axios.get(url);
      const data = response.data.data;
      return data?.map((data, index) => ({
        sr: index + 1,
        key: data.id,
        id: data.id,
        title: data?.attributes?.title,
        note: data?.attributes?.note,
        medium: data?.attributes?.medium,
        amount: data?.attributes?.amount,
        paymnetDate: data?.attributes?.paymnetDate,
        type: data?.attributes?.type,
        month: data?.attributes?.month,
        year: data?.attributes?.year,
      }));

    } catch (error) {
      console.error("Error fetching expenses:", error.response.data);
      throw error;
    }
  };

  const { isLoading, error, data } = useQuery(["expenses", url], fetchApi);

  return {
    isLoading,
    error,
    data,
  };
}
