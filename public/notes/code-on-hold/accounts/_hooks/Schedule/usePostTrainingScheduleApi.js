import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import * as qs from "qs-esm";

const usePostTrainingScheduleApi = () => {
  const queryClient = useQueryClient();

  const query = qs.stringify({
    populate: {
      trainingCourse: {
        fields: ["id", "duration", "startDate", "endDate", "nick"],
      },
    },
  });

  return useMutation(
    async (dataObj) => {
      console.log("dataObj", dataObj);

      const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/training-schedules?${query}`;
      const res = await axios.post(url, { ...dataObj });
      return res.data;
    },
    {
      onSuccess: () => {
        console.log("training schedule created successfully!");
        queryClient.invalidateQueries("trainingSchedule");
      },
      onError: (error) => {
        console.error("Error in POST request:", error);
      },
    }
  );
};

export default usePostTrainingScheduleApi;
