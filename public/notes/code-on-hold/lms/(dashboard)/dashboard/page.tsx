import React, { Suspense } from "react";
import Header from "../../components/Header";
import DashboardContent from "./components/DashboardContent";
import { ClassCardSkeletonGrid } from "./components/ClassCardSkeleton";
import { getTodayClasses } from "./serverActions/getTodayClasses";
import { ClassesResponse } from "./types";

import { headers as getHeaders } from "next/headers"

export default async function DashboardPage() {

  const headers = await getHeaders()

  const promiseClasses = getTodayClasses(headers)
    .catch(err => err instanceof Error ? err.message : String(err)) as Promise<ClassesResponse | string>;

  return (
    <>
      <Header title="Dashboard" subtitle="View your today's classes and join live sessions" />

      <h2 className="text-2xl font-bold text-[#6e6e6e] mt-8 pb-4">Today&#39;s Classes</h2>

      <Suspense fallback={<ClassCardSkeletonGrid />}>
        <DashboardContent promiseClasses={promiseClasses} />
      </Suspense>
    </>
  );
}
