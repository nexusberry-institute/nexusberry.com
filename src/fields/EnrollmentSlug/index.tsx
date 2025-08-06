"use client"

import React, { useEffect, useState } from "react"
import { useField, TextInput, FieldLabel, useFormFields, FieldDescription } from '@payloadcms/ui'
import { getData } from "./getStudentandCourse"
import { formatSlug } from "../slug/formatSlug"

export default function EnrollmentSlug({ field, path }: { field: any, path: string }) {
  const [error, setError] = useState("")

  const { value, setValue } = useField<string>({ path: path || field.name })

  const studentId = useFormFields(([fields, dispatch]) => fields.student?.value) as number
  const courseId = useFormFields(([fields, dispatch]) => fields["training-course"]?.value) as number

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (studentId && courseId) {
          const [student, course] = await Promise.all([
            getData(studentId, "students", { fullName: true }),
            getData(courseId, "training-courses", { slug: true }),
          ])

          const studentSlug = formatSlug(student.fullName || student.gmail_username || "no name")

          setValue(`${student.id}-${studentSlug}-${course.slug}`)
        }
      } catch (error) {
        setError(`Failed to create Slug: ${error instanceof Error ? error.message : "Unknown Error"}`)
      }
    }

    fetchData()

  }, [studentId, courseId])

  return (
    <div>
      <FieldLabel
        htmlFor={`field-${path}`}
        label={field.label}
        required={field.required}
      />
      <TextInput
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        readOnly={field.admin.readOnly}
        path={path}
        showError={Boolean(error)}
        Error={error && <b style={{ color: "red" }}>{error}</b>}
      />
      <FieldDescription
        description={field.admin.description}
        path="path"
      />
    </div>
  )
}
