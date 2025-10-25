import axios from "axios";
import { useQuery } from "react-query";
import * as qs from "qs-esm";

export default function useGetTrainingCoursesApi(active = true) {
  const { data, isLoading, isError, error } = useQuery(
    ["use-get-training-courses-api", active],
    async () => {
      const url = makeUrl(active);
      const { data } = await axios.get(url);
      return data;
    },
    {
      select: (apiData) => {
        const trainingCourses = transform(apiData.data);
        // console.log("UseGetTrainingCourseApi:url ", trainingCourses);
        return trainingCourses;
      },
    }
  );
  return {
    trainingCourses: data,
    isLoading,
    isError,
    error,
  };
}

const makeUrl = (active) => {
  const query = qs.stringify(
    {
      filters: {
        active: active
      },
      populate: {
        students:{
          fields:
            ['id']
        }
      },
      sort: ["createdAt:desc"]
    },
    {
      encodeValuesOnly: true,
    }
  );
  const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/training-courses?${query}`;
  // console.log("UseGetTrainingCourseApi:url ", url);
  return url;
};
const transform = (Courses) => {
  return Courses.map((course, index) => {
    return { 
      id: course.id, 
      sr: index+1,
      ...course.attributes,
      students: course.attributes.students?.data?.length ?? 0
    };
  });
};
