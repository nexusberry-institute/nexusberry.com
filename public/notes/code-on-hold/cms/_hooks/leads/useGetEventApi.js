import { useQuery } from "react-query";
import * as qs from "qs-esm";
import axios from "axios";

const useGetEventApi = () => {
  const { data, isLoading, error, isError } = useQuery(
    ["use-get-event-api"],
    async () => {
      const url = makeUrl();
      const { data } = await axios.get(url);
      // console.log("data: ", data);
      return data;
    },
    {
      // enabled
      select: (apiData) => {
        const events = transform(apiData);
        // console.log("events", events)
        return events;
      },
    }
  );
  return {
    events: data,
    isLoading,
    error,
    isError,
  };
};

const makeUrl = () => {
  const query = qs.stringify(
    {},
    {
      encodeValuesOnly: true,
    }
  );
  const url = `${process.env.NEXT_PUBLIC_API_KEY}/events?${query}`;
  // console.log("event url", url);
  return url;
};
const transform = (events) => {
  // console.log("events before map",events)
  events = events.data.map((event) => {
    let c = { id: event.id, ...event.attributes };
    return c;
  });
  // console.log('useExistingEventsApi:transform = ', events);
  return events;
};
export default useGetEventApi;
