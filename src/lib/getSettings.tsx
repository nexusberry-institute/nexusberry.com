
"use server";

import { getPayload } from "payload";
import config from "@/payload.config";

export const getSettings = async () => {
    const payload = await getPayload({ config });

    const settings = await payload.findGlobal({
        slug: "settings",
        depth: 1,
    });

    // console.log("Data Fetched", settings);

    return settings;
};
