import { useMutation } from "react-query";
import axios from "axios";

const usePostFeeInstallmentApi = () => {
  const mutation = useMutation(async ({installments, studentId, selectedCourseId}) => {
    const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/fee-installments`;

      const results = await Promise.all(
        installments.map(async (installment) => {
          const res = await axios.post(url, {
            data: {
              ...installment,
              student: studentId,
              trainingCourse: selectedCourseId,
            },
          });
          return res.data;
        })
      );
      return results;
  });

  return mutation;
};

export default usePostFeeInstallmentApi;