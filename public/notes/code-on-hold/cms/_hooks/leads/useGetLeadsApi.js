import axios from "axios";
import { useQuery } from "react-query";
import * as qs from "qs-esm";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@cms/_settings/api";
import { formatDateString } from "@cms/_lib/formatDate";

const useGetLeadsApi = (props) => {
  let { page, pageSize, filters } = props;

  const { data, isLoading, isError, error } = useQuery(
    ["use-get-leads-api", page, pageSize, filters],
    async () => {
      const url = makeUrl(
        { page, pageSize, apiFilters: filters });
      const { data } = await axios.get(url);
      return data;
    },
    {
      // enabled: !!page,
      select: (apiData) => {
        const transformedData = transform(apiData.data);
        const pagination = apiData.meta.pagination;
        return { transformedData, pagination };
      },
    }
  );

  return {
    leads: data?.transformedData?.leads,
    apiPagination: data?.pagination,
    isLoading,
    isError,
    error,
  };
};

const makeUrl = ({ page, pageSize, apiFilters }) => {
  let filters = {};
  // search filter: id, mobile, name, email
  if (apiFilters.search && apiFilters.search !== "all") {
    filters = {...filters,
      [apiFilters.search.type]: {$containsi: apiFilters.search.value }
    }
  }

  // category filter
  if (apiFilters.category && apiFilters.category !== "all")
    filters = {...filters, category: apiFilters.category }

  // course filter
  if (apiFilters.course && apiFilters.course !== "all") 
    filters = {...filters, course: apiFilters.category }

  // event filter
  if (apiFilters.event && apiFilters.event !== "all")
    filters = {...filters, event: apiFilters.event }
  
  // source filter
  if (apiFilters.source && apiFilters.source !== "all")
    filters = {...filters, event: apiFilters.event }

  // assignTo filter
  if (apiFilters.assignedTo && apiFilters.assignedTo !== "all") {
    filters = {...filters,
      assignLeedTo: {
        assignTo: {
          name: apiFilters.assignedTo,
        },
      },
    };
  }

    // date filter
    if (apiFilters.periodStart && apiFilters.periodEnd) {
      const periodEnd = new Date(apiFilters.periodEnd);
      periodEnd.setDate(periodEnd.getDate() + 1);
      filters = {...filters,
        createdAt: {
          $gte: apiFilters.periodStart,
          $lte: periodEnd.toISOString().split("T")[0],
        },
      };
    }

  const query = qs.stringify(
    {
      filters,
      pagination: {
        page: page || 1,
        pageSize: pageSize ? (pageSize <= MAX_PAGE_SIZE ? pageSize : MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE,
      },
      sort: ["createdAt:desc"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  const url = `${process.env.NEXT_PUBLIC_API_KEY }/leeds?${query}`;
  // console.log("useGetLeadsApi:URL: ", url);
  return url;
};

const transform = (leads) => {
  leads = leads.map((lead) => {
    lead = { id: lead.id, ...lead.attributes };
    lead.key = lead.id;
    // lead.date = new Date(lead.createdAt).toString();
    lead.date = formatDateString(lead.createdAt)
    if (lead.assignLeedTo?.data?.length) {
      lead.assignLeedTo = lead.assignLeedTo.data.map((assignLeed) => ({
        id: assignLeed.id,
        ...assignLeed.attributes,
      }));
    }
    return lead;
  });

  return { leads };
};

export default useGetLeadsApi;
