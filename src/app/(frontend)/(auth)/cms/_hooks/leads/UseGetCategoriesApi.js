import axios from "axios";
import * as qs from "qs-esm";
import { useQuery } from "react-query";

const UseGetCategoriesApi = () => {
  const { data, isLoading, isError, error } = useQuery(
    ["use-get-categories-api"],
    async () => {
      const url = makeurl();
      const { data } = await axios.get(url);
      return data;
    },
    {
      // enabled: !!page,
      select: (apiData) => {
        const categories = transform(apiData.data);
        // console.log("webcoursescategories", webcoursescategories);
        return categories;
      },
    }
  );

  return {
    categories: data,
    isLoading,
    isError,
    error,
  };
};

const makeurl = () => {
  const query = qs.stringify(
    {
    
    },
    {
      encodeValuesOnly: true,
    }
  );

  const url = `${process.env.NEXT_PUBLIC_API_KEY}/web-course-categories?${query}`;
  // console.log("review url", url);
  return url;
};

const transform = (categories) => {
  categories = categories.map((category) => {
    let c = { id: category.id, ...category.attributes };
    return c;
  });
  // console.log("webcoursescategories", categories);
  return categories;
};

export default UseGetCategoriesApi;