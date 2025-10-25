import axios from "axios";
import { useQuery } from "react-query";
import * as qs from "qs-esm";

export default function useGetTrainingScheduleApi() {
  const query = qs.stringify({
    filters:{
      trainingCourse: {
        active: true
      }
    },
    populate: {
      trainingCourse: {
        fields: ["id", "duration", "startDate", "endDate", "nick"],
      },
    },

    pagination: {
      page: 1,
      pageSize: 1000,
    },

    encodeValuesOnly: true,
  });

  const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/training-schedules?${query}`;

  const fetchApi = async () => {
    try {
      const response = await axios.get(url);
      return response.data.data;
    } catch (error) {
      console.log("this is error", error);
    }
  };

  const { isLoading, error, data } = useQuery("trainingSchedule", fetchApi);
  // const { isLoading, error, data } = useQuery(["apiData", url], fetchApi);

  return {
    isLoading,
    error,
    data,
  };
}
