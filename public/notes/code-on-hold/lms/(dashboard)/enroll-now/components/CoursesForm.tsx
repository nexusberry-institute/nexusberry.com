'use client'

import { useFormContext } from 'react-hook-form'
import { FormMessage } from '@/components/ui/form'
import { Batch } from '../serverActions/getTransformedBatches'
import CourseCard from './CourseCard'

const CoursesForm = ({ batches, handleNext }: {
  batches: (Batch | null)[],
  handleNext: () => Promise<void>
}) => {
  const { setValue, formState: { errors } } = useFormContext()

  const handleEnroll = (batchId: number) => {
    setValue('batchId', batchId, { shouldValidate: true })
    handleNext()
  }

  return (
    <div className="space-y-6">
      {errors.batchId && <FormMessage>{errors.batchId.message as string}</FormMessage>}
      {batches.map((batch) => (
        batch && <CourseCard
          key={batch.id}
          batch={batch}
          handleEnroll={handleEnroll}
        />
      ))}
    </div>
  )
}

export default CoursesForm