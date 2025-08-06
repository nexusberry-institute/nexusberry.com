"use server";

import { getPayload } from "payload";
import config from "@/payload.config";

export const getImpactData = async () => {
    const payload = await getPayload({ config });

    const impactSection = await payload.findGlobal({
        slug: "impact-section",
        depth: 2,
    });
    // console.log("results", impactSection);
    return impactSection;
};
