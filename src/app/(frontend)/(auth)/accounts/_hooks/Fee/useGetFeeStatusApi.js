import axios from "axios";
import { useQuery } from "react-query";
import * as qs from "qs-esm";
import { format } from "date-fns";
import { feeStatus } from "@accounts/_enums/fee-status";

const useGetFeeStatusApi = ({ page, pageSize, filters }) => {
  const { data, isLoading, isError, error } = useQuery(
    [
      "use-get-fee-status-api",
      page,
      pageSize,
      filters.status,
      filters.periodStart,
      filters.periodEnd,
      filters.search,
      filters.course,
    ],
    async () => {
      const url = makeUrl({
        page,
        pageSize,
        apiFilters: filters,
      });
      const { data } = await axios.get(url);
      // console.log(data);
      return data;
    },
    {
      //   enabled: !!id,
      select: (apiData) => {
        const feeInstallments = transform(apiData.data);
        const pagination = apiData.meta.pagination;
        return { feeInstallments, pagination };
      },
    }
  );
  return {
    installments: data,
    apiPagination: data?.pagination,
    isLoading,
    isError,
    error,
  };
};

const makeUrl = ({ page, pageSize, apiFilters }) => {
  let filters = {
    status: {
      $eq: apiFilters.status,
    },
  };
  
  if (apiFilters.periodStart) {
    filters = {...filters,
      dueDate: {
        $gte: apiFilters.periodStart,
      },
    };
  }
  if (apiFilters.periodEnd) {
    const periodEnd = new Date(apiFilters.periodEnd);
    periodEnd.setDate(periodEnd.getDate() + 1);
    filters = {...filters,
      dueDate: {
        $lte: periodEnd.toISOString().split("T")[0],
      },
    };
  }

  if (apiFilters.search.type === "id") {
    filters = {...filters,
      id: {
        $containsi: apiFilters.search.value,
      },
    };
  } else if (apiFilters.search.type === "name") {
    filters = {...filters,
      student: {
        name: {
          $containsi: apiFilters.search.value,
        },
      },
    };
  }

  if (apiFilters.course && apiFilters.course !== "all") {
    filters = {...filters,
      trainingCourse: {
        nick: {
          $eq: apiFilters.course,
        },
      },
    };
  }

  const sort = [];
  if(apiFilters.status === feeStatus.Received)
    sort.push("paymentDate:desc");
  else if(apiFilters.status === feeStatus.Pending)
  sort.push("dueDate:asc");
  else if(apiFilters.status === feeStatus.Dead)
  sort.push("updatedAt:desc");

  const query = qs.stringify(
    {
      sort,
      filters,
      populate: {
        student: {
          fields: ["name", "mobile", "email"],
        },
        trainingCourse: {
          fields: ["nick"],
        },
      },
      pagination: {
        page,
        pageSize,
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const url = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/fee-installments?${query}`;
  // console.log("useGetFeeStatusApi:URL: ", url);
  return url;
};

const transform = (feeInstallments) => {
  if (feeInstallments?.length) {
    let installments = feeInstallments.map((installment) => {
      installment = {
        id: installment.id,
        ...installment.attributes,
      };

      installment.id_name = `${installment.id} | ${
        installment?.student?.data?.attributes?.name || ""
      } | ${installment?.student?.data?.attributes?.mobile || ""}`;
      installment.paymentDate = format(new Date(installment?.paymentDate), "do MMM yy");
      installment.dueDate = format(new Date(installment?.dueDate), "do MMM yy");
      installment.key = installment.id;
      installment.amount_dueDate = `${installment.amount.toLocaleString()} | ${
        installment.dueDate
      }`;

      if (installment.student?.data) {
        installment.student = installment.student.data.attributes?.name;
      }

      if (installment.trainingCourse?.data) {
        installment.trainingCourse =
          installment.trainingCourse.data.attributes?.nick;
      }

      return installment;
    });

    // console.log("feeInstallments: after", installments);
    return installments;
  }
};
export default useGetFeeStatusApi;
