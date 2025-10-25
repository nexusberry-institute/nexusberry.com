import axios from "axios";
import { useQuery } from "react-query";
import * as qs from "qs-esm";

export default function UseGetTrainingCourseApi() {
  const { data, isLoading, isError, error } = useQuery(
    ["use-get-trainingcourses-api"],
    async () => {
      const url = makeUrl();
      const { data } = await axios.get(url);
      return data;
    },
    {
      select: (apiData) => {
        const trainingCourses = transform(apiData.data);
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

const makeUrl = () => {
  const query = qs.stringify(
    {
      filters: {
        active: {
          $eq: "true",
        },
      }
    },
    {
      encodeValuesOnly: true,
    }
  );
  const url = `${process.env.NEXT_PUBLIC_API_KEY}/training-courses?${query}`;
  // console.log("UseGetTrainingCourseApi:url ", url);
  return url;
};
const transform = (Courses) => {
  Courses = Courses.map((Course) => {
    let c = { id: Course.id, ...Course.attributes };
    return c;
  });
  return Courses;
};
