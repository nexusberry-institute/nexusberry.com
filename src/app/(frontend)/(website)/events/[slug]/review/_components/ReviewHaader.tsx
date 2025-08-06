export default async function ReviewHaader({ title }: { title: string }) {

  return (
    <div className='w-70% space-y-2 mt-4'>
      <h1 className="text-3xl font-bold text-center">Review Form</h1>
      <p className="text-center text-gray-600 mb-4">Please fill your details to get your certificate.</p>
      <h2 className="text-lg font-semibold text-center mb-6">
        Event: {title || "NexusBerry Event"}
      </h2>
    </div>
  )
}
