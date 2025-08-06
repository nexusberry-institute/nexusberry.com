import { getPayload } from "payload";
import config from "@payload-config";

export interface Batch {
  id: number;
  slug: string;
  duration: number;
  medium: "ONLINE" | "PHYSICAL" | "HYBRID";
  CId: number;
  CSlug: string;
  CTitle: string;
  CDescription?: string | null;
  CFullPrice: number;
  CStatus: "active" | "inactive" | null | undefined;
  paymentPlans: number[] | undefined
  batchTimeTable: {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
  }[] | null | undefined
}

export const getTransformedBatches = async (batchIds?: string | string[]) => {

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: "batches",
    limit: 1000,
    where: {
      canEnroll: { equals: true },
      id: { not_in: batchIds }
    },
    select: {
      slug: true,
      "training-courses": true,
      duration: true,
      medium: true,
      batchTimeTable: true
    },
    populate: {
      "training-courses": {
        status: true,
        slug: true,
        title: true,
        description: true,
        fullPrice: true,
        relatedPaymentPlans: true
      },
      "time-table": {
        day: true,
        startTime: true,
        endTime: true,
      },
      "payment-plans": {
        name: true
      }
    },
    pagination: false,
    sort: "-createdAt",
  });

  const batches = docs.map((batch) => {
    if (typeof batch["training-courses"] === "number") return null;
    return {
      id: batch.id,
      slug: batch.slug,
      duration: batch.duration,
      medium: batch.medium,
      CId: batch["training-courses"].id,
      CSlug: batch["training-courses"].slug,
      CTitle: batch["training-courses"].title,
      CDescription: batch["training-courses"].description,
      CFullPrice: batch["training-courses"].fullPrice,
      CStatus: batch["training-courses"].status,
      paymentPlans: batch["training-courses"].relatedPaymentPlans?.docs as number[],
      batchTimeTable: batch["batchTimeTable"]?.docs?.filter(TimeTable => typeof TimeTable !== "number") || [],
    }
  })

  return batches
}