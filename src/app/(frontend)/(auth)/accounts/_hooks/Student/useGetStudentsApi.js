import axios from "axios";
import { useQuery } from "react-query";
import * as qs from "qs-esm";

const useGetStudentsApi = ({ page, pageSize, filters }) => {
  const { data, isLoading, isError, error } = useQuery(
    ["use-get-students-api", page, pageSize, filters],
    async () => {
      const url = makeUrl({ page, pageSize, apiFilters: filters });
      const { data } = await axios.get(url);
      // console.log("students get",data)
      return data;
    },
    {
      enabled: !!filters.course,
      select: (apiData) => {
        const student = transform(apiData.data, filters.course);
        const pagination = apiData.meta.pagination;
        return { student, pagination };
      },
    }
  );

  return {
    students: data?.student,
    apiPagination: data?.pagination,
    isLoading,
    isError,
    error,
  };
};

const makeUrl = ({ page, pageSize, apiFilters }) => {
  let filters = {};

  // search filter
  if (apiFilters.search && apiFilters.search.value && apiFilters.search !== "all") {
    if (apiFilters.search.type === "id") {
      filters = {
        ...filters,
        id: {
          $eq: apiFilters.search.value,
        },
      };
    } else  { // name, mobile, email
      filters = {
        ...filters,
        [apiFilters.search.type]: {
          $containsi: apiFilters.search.value,
        },
      };
    }
  }

  // course filter
  if(apiFilters.course && apiFilters.course !== "all") {
    filters = {
      ...filters,
      trainingCourses: {
        id: apiFilters.course,
      },
    };
  }

  const query = qs.stringify(
    {
      filters,
      pagination: {
        page,
        pageSize,
      },
      populate: {
        trainingCourses: true,
        admissions: {
          populate: {
            trainingCourse: true
          }
        },
        feeInstallments: {
          populate: {
            trainingCourse: "*",
          },
        },
      },

      sort: ["createdAt:desc"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/students?${query}`;
  // console.log("useGetStudentsApi:URL: ", url);
  return url;
};

const transform = (students, courseId) => {
  students = students.map((student) => {
    student = { id: student.id, ...student.attributes };

    if (student.admissions?.data?.length) {
      student.admissions = student.admissions.data.map(
        (admissions) => ({
          id: admissions.id,
          ...admissions.attributes,
        })
      );
      student.completionStatus = student.admissions.find(
        adm => adm?.trainingCourse?.data?.id === courseId
      )?.completionStatus ?? "Admission Missing";
    }

    if (student.trainingCourses?.data?.length) {
      student.trainingCourses = student.trainingCourses.data.map(
        (trainingCourse) => ({
          id: trainingCourse.id,
          ...trainingCourse.attributes,
        })
      );
    }

    if (student.feeInstallments?.data?.length) {
      student.feeInstallments = student.feeInstallments.data.filter(
        f => f?.attributes?.trainingCourse?.data?.id === courseId
      ).map(
        (installment) => ({
          id: installment.id,
          ...installment.attributes,
          courseId: installment.attributes.trainingCourse?.data?.id,
          couseNick: installment.attributes.trainingCourse?.data?.attributes?.nick
        })
      ).sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA - dateB;
      })
      student.totalAmount = student.feeInstallments
        .reduce((acc, item) => acc + item.amount, 0)
        .toLocaleString();
    }
    return student;
  });

  // console.log("useGetStudentApi:transform: ", students);
  return students;
};
export default useGetStudentsApi;
