import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export const ClassCardSkeleton = () => (
  <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md border-l-4 border-l-primary animate-pulse">
    <CardHeader className="pb-2">
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2"></div>
    </CardHeader>

    <CardContent className="flex-grow">
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-700 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        {/* <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-700 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div> */}
        <div className="mt-4 bg-gray-700 rounded-md p-3 h-16"></div>
      </div>
    </CardContent>

    <CardFooter className="pt-2 mt-auto">
      <div className="h-10 bg-gray-700 rounded w-full"></div>
    </CardFooter>
  </Card>
);

export const ClassCardSkeletonGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <ClassCardSkeleton key={i} />
    ))}
  </div>
);
