import { useQuery } from "react-query";
import * as qs from "qs-esm";
import axios  from "axios";

const useGetMessagesApi = (show) => {
  const { data, isLoading, error, isError } = useQuery(
    ["use-get-messages-api", show],
    async () => {
      const url = makeUrl();
      const { data } = await axios.get(url);
      return data;
    },
    {
      enabled: !!show,
      select: (apiData) => {
        const messages = transform(apiData);
        return messages;
      },
    }
  );
  return {
    messages: data,
    isLoading,
    error,
    isError,
  };
};

const makeUrl = () => {
  const query = qs.stringify(
    {
        filters: {type: "WHATSAPP"}
    },
    {
      encodeValuesOnly: true,
    }
  );
  const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/messages?${query}`;
  // console.log(url);
  return url;
};

const transform = (messages) => {
    messages = messages.data.map(message => ({ id: message.id, ...message.attributes }));
    // console.log(messages);
    return messages;
};

export default useGetMessagesApi;