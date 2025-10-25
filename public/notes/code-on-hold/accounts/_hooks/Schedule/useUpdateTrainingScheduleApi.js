import axios from "axios";
import * as qs from "qs-esm";
import { useMutation, useQueryClient } from "react-query";

const useUpdateTrainingScheduleApi = () => {
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
      if (!dataObj.id) {
        throw new Error("Missing training schedule ID for update.");
      }

      const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/training-schedules/${dataObj.id}?${query}`;
      console.log("Sending to API:", dataObj.data);
      const res = await axios.put(url, { ...dataObj });
      return res.data;
    },
    {
      onSuccess: () => {
        console.log("Training schedule updated successfully!");
        queryClient.invalidateQueries("trainingSchedule");
      },
      onError: (error) => {
        console.error("Error in PUT request:", error);
      },
    }
  );
};

export default useUpdateTrainingScheduleApi;
