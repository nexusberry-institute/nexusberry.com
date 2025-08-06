"use server";
import { getPayload } from "payload";
import config from "@/payload.config";

export const getCourseModules = async (slug: string) => {
  const payload = await getPayload({ config });

  const courses = await payload.find({
    collection: "web-courses",
    where: {
      slug: {
        equals: slug, // better match than contains
      },
    },
    limit: 1,
    depth: 1,
  });

  const course = courses.docs?.[0];

  if (!course) {
    console.warn(`No course found with slug: ${slug}`);
    return [];
  }

  if (!Array.isArray(course.modules)) {
    console.warn("Modules field is missing or not an array.");
    return [];
  }

  return course.modules;
};

export default getCourseModules;
