"use client"

import React, { useEffect, useState } from "react"
import { useField, TextInput, FieldLabel, useFormFields, FieldDescription } from '@payloadcms/ui'
import { getCourse } from "./getCourse"

export default function TotalPrice({ field, path }: { field: any, path: string }) {

  const [error, setError] = useState("")

  const { value, setValue } = useField<string>({ path: path || field.name })

  const courseId = useFormFields(([fields, dispatch]) => fields["training-course"]?.value) as number

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (courseId) {
          const price = await getCourse(courseId)
          setValue(price)
          return;
        }
      } catch (error) {
        setError(`Failed to get Price: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    fetchData()

  }, [courseId])

  return (
    <div>
      <FieldLabel
        htmlFor={`field-${path}`}
        label={field.label}
        required={field.required}
      />
      <TextInput
        value={value || "No Course Selected"}
        onChange={(e: any) => setValue(e.target.value)}
        readOnly={field.admin.readOnly}
        path={path}
        showError={Boolean(error)}
        Error={error && <b style={{ color: "red" }}>{error}</b>}
      />
      <FieldDescription
        description={field.admin.description}
        path={path}
      />
    </div>
  )
}
