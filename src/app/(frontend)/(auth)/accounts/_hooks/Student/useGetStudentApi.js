import axios from "axios";
import { useQuery } from "react-query";
import * as qs from "qs-esm";

const useGetStudentApi = (id) => {
  const { data, isLoading, isError, error } = useQuery(
    ["use-get-student-api", id],
    async () => {
      const url = makeUrl(id);
      const { data } = await axios.get(url);
      return data;
    },
    {
      enabled: !!id,
      select: (apiData) => {
        const students = transform(apiData.data);
        return students;
      },
    }
  );
  return {
    student: data,
    isLoading,
    isError,
    error,
  };
};

const makeUrl = (id) => {
  const query = qs.stringify(
    {
      populate: {
        admissions: true,
        trainingCourses: true,
        feeInstallments: true,
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/students/${id}?${query}`;
  // console.log("useGetStudentApi:URL: ", url);
  return url;
};

const transform = (student) => {
  student = { id: student.id, ...student.attributes };
  if (student.trainingCourses?.data?.length) {
    student.trainingCourses = student.trainingCourses.data.map(
      (trainingCourse) => ({
        id: trainingCourse.id,
        ...trainingCourse.attributes,
      })
    );
  }

  if (student.feeInstallments?.data?.length) {
    student.feeInstallments = student.feeInstallments.data.map(
      (installment) => ({
        id: installment.id,
        ...installment.attributes,
      })
    );
  }

  return student;
};
export default useGetStudentApi;
