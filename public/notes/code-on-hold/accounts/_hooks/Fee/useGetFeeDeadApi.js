import axios from "axios";
import { useQuery } from "react-query";
import * as qs from "qs-esm";
import { formatDate } from "@accounts/_lib/formatDate";

const useGetFeeDeadApi = ({ page, pageSize, filters }) => {
  const { data, isLoading, isError, error } = useQuery(
    [
      "use-get-fee-dead-api",
      page,
      pageSize,
      filters.periodStart,
      filters.periodEnd,
      filters.search,
      filters.course,
    ],
    async () => {
      const url = makeUrl({ page, pageSize, apiFilters: filters });
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
      $eq: "Dead",
    },
  };

  if (apiFilters.periodStart && apiFilters.periodEnd) {
    const periodEnd = new Date(apiFilters.periodEnd);
    periodEnd.setDate(periodEnd.getDate() + 1);
    // console.log("periodEnd: ", periodEnd.toISOString().split("T")[0]);
    filters = {
      ...filters,
      paymentDate: {
        $gte: apiFilters.periodStart,
        $lte: periodEnd.toISOString().split("T")[0],
      },
    };
  }

  if (apiFilters.search.type === "id") {
    filters = {
      ...filters,
      id: {
        $containsi: apiFilters.search.value,
      },
    };
  } else if (apiFilters.search.type === "name") {
    filters = {
      ...filters,
      student: {
        name: {
          $containsi: apiFilters.search.value,
        },
      },
    };
  }

  if (apiFilters.course && apiFilters.course !== "all") {
    filters = {
      ...filters,
      trainingCourse: {
        nick: {
          $eq: apiFilters.course,
        },
      },
    };
  }

  const query = qs.stringify(
    {
      filters,
      populate: {
        // feeInstallments: true,
        student: {
          fields: ["name"],
        },
        trainingCourse: {
          fields: ["nick"],
        },
      },
      // sort: ["paymentDate:desc"],
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
  //   console.log("useGetFeeDeadApi:URL: ", url);
  return url;
};

const transform = (feeInstallments) => {
  if (feeInstallments?.length) {
    let installments = feeInstallments.map((installment) => {
      installment = {
        id: installment.id,
        ...installment.attributes,
      };

      installment.key = installment.id;
      installment.paymentDate = formatDate(
        installment?.paymentDate?.split("T")[0]
      );
      installment.dueDate = formatDate(installment?.dueDate?.split("T")[0]);
      installment.amount = installment.amount.toLocaleString();

      if (installment.student?.data) {
        installment.student = installment.student.data.attributes.name;
      }

      if (installment.trainingCourse?.data) {
        installment.trainingCourse =
          installment.trainingCourse.data.attributes.nick;
      }

      return installment;
    });

    // console.log("feeInstallments: after", installments);
    return installments;
  }
};
export default useGetFeeDeadApi;
