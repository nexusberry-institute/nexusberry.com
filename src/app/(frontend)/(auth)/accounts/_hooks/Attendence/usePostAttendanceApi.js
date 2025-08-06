import * as qs from "qs-esm";

export const usePostAttendanceApi = () => {
  const query = qs.stringify({
    populate: {
      trainingCourse: "*",
      attendees: "*",
    },
  });

  const detailUrl = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/course-attendance-details?${query}`;
  const navUrl = `${process.env.NEXT_PUBLIC_ACCOUNT_API_KEY}/course-attendances?${query}`;

  return { detailUrl, navUrl };
};
