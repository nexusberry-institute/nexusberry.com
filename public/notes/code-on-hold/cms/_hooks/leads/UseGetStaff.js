import { useQuery } from "react-query";
import * as qs from "qs-esm";
import axios  from "axios";

const useGetStaffApi = () => {
  const { data, isLoading, error, isError } = useQuery(
    ["use-get-staff-api"],
    async () => {
      const url = makeUrl();
      const { data } = await axios.get(url);
      return data;
    },
    {
      // enabled
      select: (apiData) => {
        const staffList = transform(apiData);
        // console.log("StaffList", staffList)
        return staffList;
      },
    }
  );
  return {
    staffList: data,
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
  const url = `${process.env.NEXT_PUBLIC_API_KEY}/staffs?${query}`;
  // console.log("Staff url", url);
  return url;
};
const transform = (staffList) => {
  // console.log("stafflist before map",staffList)
  staffList = staffList.data.map((staff) => {
    let c = { id: staff.id, ...staff.attributes };
    return c;
  });
  // console.log('useExistingStaffListApi:transform = ', staffList);
  return staffList;
};
export default useGetStaffApi;