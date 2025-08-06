"use server";

import { getPayload } from "payload";
import config from "@/payload.config";

export const getCoursesCollection = async () => {
    const payload = await getPayload({ config });

    const result = await payload.find({
        collection: "courses-collection",
        limit: 10, // increase this to get more if needed
        depth: 2,   // important to populate courseCard data from 'web-courses'
    });

    return result.docs || [];
};
