"use client"

import React, { use } from "react";
import { ClassCard } from "./ClassCard";
import { ClassesResponse } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import AuthError from "../../../components/AuthError";

export default function DashboardContent({ promiseClasses }: { promiseClasses: Promise<ClassesResponse | string> }) {
  const response = use(promiseClasses)

  if (typeof response === "string") return <AuthError title="Error Getting Today Classes" desc={response} />

  const { classes } = response

  if (!classes || !classes.length) {
    return (
      <Card className="bg-gray-800 border-none shadow-md">
        <CardContent className="pt-6 pb-6">
          <p className="text-center text-muted-foreground">No classes scheduled for today.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <ClassCard
          key={`${classItem.id}-${classItem.batch.id}`}
          classItem={classItem}
          batch={classItem.batch}
          enrollmentId={classItem.enrollmentId}
        />
      ))}
    </div>
  );
}