import { Suspense } from 'react'
import AdmissionForm from './AdmissionForm'

export const metadata = {
  title: 'Admission Form | NexusBerry',
  description: 'Submit your admission application to NexusBerry Training & Solutions.',
}

export default function AdmissionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <AdmissionForm />
    </Suspense>
  )
}
