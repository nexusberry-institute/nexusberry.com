// import axios from "axios";
import { useQuery } from "react-query";
import * as qs from "qs-esm";
import { leadStatus, leadApiStatus } from "@cms/_models/lead";
import axios from "axios";
const useGetDashboardLeadApi = (props) => {
  let { page, pageSize, filters } = props;
  const { data, isLoading, isError, error } = useQuery(
    ["use-get-dashboard-leads-api", page, pageSize, filters],

    async () => {
      const urlForPageSize = `${process.env.NEXT_PUBLIC_API_KEY}/leeds?pagination[pageSize]=1&fields[0]=id&fields[1]=name`;
      const singleLeadsData = await axios.get(urlForPageSize);
      const totalLeadsCount = singleLeadsData?.data?.meta?.pagination?.total;
      console.log("totalLeadsCount", totalLeadsCount);
      console.log("singleLeadData", singleLeadsData);

      const url = makeUrl({
        page,
        pageSize: totalLeadsCount,
        apiFilters: filters,
      });
      const { data } = await axios.get(url);

      return data;
    },
    {
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
    stageWiseLeads: data?.transformedData?.stageWiseLeads,
    leadsCount: data?.transformedData?.leadsCount,
    reminderColor: data?.transformedData?.leads?.reminderColor,
    isLoading,
    isError,
    error,
  };
};

const makeUrl = ({ page, pageSize, apiFilters }) => {
  let filters = {};

  if (apiFilters.periodStart && apiFilters.periodEnd) {
    const periodEnd = new Date(apiFilters.periodEnd);
    periodEnd.setDate(periodEnd.getDate() + 1);

    filters = {
      ...filters,
      createdAt: {
        $gte: apiFilters.periodStart,
        $lte: periodEnd.toISOString().split("T")[0],
      },
    };
  }

  if (apiFilters.category && apiFilters.category !== "all") {
    filters = {
      ...filters,
      webCourse: {
        categories: {
          slug: apiFilters.category,
        },
      },
    };
  }

  if (apiFilters.course && apiFilters.course !== "all") {
    filters = {
      ...filters,
      webCourse: {
        slug: apiFilters.course,
      },
    };
  }

  if (apiFilters.status && apiFilters.status !== "all") {
    if (apiFilters.status === leadStatus.UNREAD) {
      filters = {
        ...filters,
        unread: true,
      };
    } else if (apiFilters.status === leadStatus.REMINDER) {
      filters = {
        ...filters,
        reminder: {
          off: false,
        },
      };
    } else if (apiFilters.status === leadStatus.PACKAGE) {
      filters = {
        ...filters,
        paymentPlan: {
          $ne: null,
        },
      };
    } else {
      if (apiFilters.status === leadStatus.FOLLOW_UP) {
        filters = {
          ...filters,
          $or: [
            {
              stage: leadApiStatus.ONE_FOLLOW_UP,
            },
            {
              stage: leadApiStatus.ONE_FOLLOW_UP_NOT_RESPONDING,
            },
          ],
        };
      } else if (apiFilters.status === leadStatus.INTERESTED) {
        filters = {
          ...filters,
          $or: [
            {
              stage: leadApiStatus.TWO_INTERESTED_LOW,
            },
            {
              stage: leadApiStatus.TWO_INTERESTED_MEDIUM,
            },
            {
              stage: leadApiStatus.TWO_INTERESTED_HIGH,
            },
          ],
        };
      } else if (apiFilters.status === leadStatus.ATTENDED_DEMO) {
        filters = {
          ...filters,
          stage: {
            $eq: leadApiStatus.THREE_ATTENDED_DEMO,
          },
        };
      } else if (apiFilters.status === leadStatus.CONFIRMED_PAYING) {
        filters = {
          ...filters,
          stage: {
            $eq: leadApiStatus.FOUR_CONFIRMED_PAYING,
          },
        };
      } else if (apiFilters.status === leadStatus.ADMITTED) {
        filters = {
          ...filters,
          stage: {
            $eq: leadApiStatus.FIVE_ADMITTED,
          },
        };
      } else if (apiFilters.status === leadStatus.REFUSED) {
        filters = {
          ...filters,
          stage: {
            $eq: leadApiStatus.NO_FOLLOWUP_REFUSED,
          },
        };
      } else if (apiFilters.status === leadStatus.WASTE) {
        filters = {
          ...filters,
          stage: {
            $eq: leadApiStatus.NO_FOLLOWUP_WASTE,
          },
        };
      }
    }
  }

  const query = qs.stringify(
    {
      filters,
      pagination: {
        page,
        pageSize,
      },

      populate: {
        webCourse: {
          populate: {
            categories: true,
          },
        },
        package: true,
        events: {
          populate: true,
        },
      },

      sort: ["createdAt:desc"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  const url = `${process.env.NEXT_PUBLIC_API_KEY}/leeds?${query}`;
  console.log("useGetLeadsApi:URL: ", url);
  return url;
};

// {leads: .., ONE_FOLLOW_UP: ..., }

const transform = (leads) => {
  let stageWiseLeads = {
    ONE_FOLLOW_UP: [],
    ONE_FOLLOW_UP_NOT_RESPONDING: [],
    TWO_INTERESTED_LOW: [],
    TWO_INTERESTED_MEDIUM: [],
    TWO_INTERESTED_HIGH: [],
    THREE_ATTENDED_DEMO: [],
    FOUR_CONFIRMED_PAYING: [],
    FIVE_ADMITTED: [],
    NO_FOLLOWUP_REFUSED: [],
    NO_FOLLOWUP_WASTE: [],
  };

  leads = leads.map((lead) => {
    lead = { id: lead.id, ...lead.attributes };
    if (lead.webCourse?.data) {
      lead.webCourse = {
        id: lead.webCourse.data.id,
        ...lead.webCourse.data.attributes,
      };
    }

    if (lead.webCourse?.categories?.data?.length) {
      lead.webCourse.categories = lead.webCourse.categories.data.map(
        (category) => ({
          id: category.id,
          ...category.attributes,
        })
      );
    }

    if (lead.events?.data?.length) {
      lead.events = lead.events.data.map((event) => ({
        id: event.id,
        ...event.attributes,
      }));
    }

    const currentDate = new Date().toISOString();

    const getReminderColorName = (reminderdDate, currentDate) => {
      if (reminderdDate === currentDate) {
        return "green";
      } else {
        return "blue";
      }
    };

    if (lead.reminder) {
      lead.reminderColor = getReminderColorName(
        lead?.reminder && lead.reminder.date
          ? lead.reminder?.date.split("T")[0]
          : null,
        currentDate.split("T")[0]
      );
    }
    const dateObj = new Date(lead.createdAt); // Convert ISO 8601 string to a Date object
    const day = dateObj.getUTCDate().toString().padStart(2, "0");
    const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
    const hours = dateObj.getUTCHours().toString().padStart(2, "0");
    const minutes = dateObj.getUTCMinutes().toString().padStart(2, "0");
    lead.date = `${day}-${month}, ${hours}:${minutes}`;

    lead.key = lead.id;

    if (
      lead.stage === leadApiStatus.ONE_FOLLOW_UP ||
      lead.stage === leadApiStatus.ONE_FOLLOW_UP_NOT_RESPONDING
    ) {
      stageWiseLeads["ONE_FOLLOW_UP"] = [
        ...stageWiseLeads["ONE_FOLLOW_UP"],
        lead,
      ];
    } else if (
      lead.stage === leadApiStatus.TWO_INTERESTED_LOW ||
      lead.stage === leadApiStatus.TWO_INTERESTED_MEDIUM ||
      lead.stage === leadApiStatus.TWO_INTERESTED_HIGH
    ) {
      stageWiseLeads["TWO_INTERESTED_LOW"] = [
        ...stageWiseLeads["TWO_INTERESTED_LOW"],
        lead,
      ];
    } else {
      if (lead.stage === leadApiStatus[lead.stage]) {
        stageWiseLeads[leadApiStatus[lead.stage]] = [
          ...stageWiseLeads[leadApiStatus[lead.stage]],
          lead,
        ];
      }
    }

    if (lead.source === "facebook") {
      lead.sourceImg =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/1024px-2021_Facebook_icon.svg.png";
    }
    if (lead.source === "instgram") {
      lead.sourceImg =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/640px-Instagram_icon.png";
    }
    if (lead.source === "Web-Inq") {
      lead.sourceImg =
        "https://png.pngtree.com/png-vector/20190217/ourmid/pngtree-vector-web-icon-png-image_555441.jpg";
    } else if (lead.source === "physical visit") {
      lead.sourceImg =
        "https://images.squarespace-cdn.com/content/v1/5572b7b4e4b0a20071d407d4/1525507753369-E5X8XRZ0E1M8IXR99O4V/FootfallAttribution_Icon_NoText.png";
    }
    return lead;
  });

  const leadsCount = {
    followUp:
      stageWiseLeads.ONE_FOLLOW_UP?.length +
        stageWiseLeads.ONE_FOLLOW_UP_NOT_RESPONDING?.length || "0",
    interested:
      stageWiseLeads.TWO_INTERESTED_LOW?.length +
        stageWiseLeads.TWO_INTERESTED_MEDIUM?.length +
        stageWiseLeads.TWO_INTERESTED_HIGH?.length || "0",
    attendedDemo: stageWiseLeads.THREE_ATTENDED_DEMO?.length || "0",
    confirmedPaying: stageWiseLeads.FOUR_CONFIRMED_PAYING?.length || "0",
    admitted: stageWiseLeads.FIVE_ADMITTED?.length || "0",
    refused: stageWiseLeads.NO_FOLLOWUP_REFUSED.length || "0",
    wasted: stageWiseLeads.NO_FOLLOWUP_WASTE.length || "0",
  };

  return { leads, stageWiseLeads, leadsCount };
};
export default useGetDashboardLeadApi;
