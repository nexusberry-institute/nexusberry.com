import { useMutation } from "react-query";
import axios from "axios";

const baseURL = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/training-schedules`;

const deleteTrainingAPI = async (id) => {
  const response = await axios.delete(`${baseURL}/${id}`);
  return response.data;
};

export const useDeleteTrainingScheduleApi = () => {
  return useMutation(deleteTrainingAPI);
};
