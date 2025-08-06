"use client"

import React from "react"
import { useField, TextInput, FieldLabel, useForm, FieldDescription } from '@payloadcms/ui'

export default function BatchesSlug({ field, path }: { field: any, path: string }) {

  const { value, setValue } = useField<string>({ path: path || field.name })
  // const { getData } = useForm()
  // useEffect(() => {
  //   const data = getData()
  //   console.log(data)
  // }, [getData])


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
        path={path}
      />
      <FieldDescription
        description={field.admin.description}
        path="path"
      />
    </div>
  )
}