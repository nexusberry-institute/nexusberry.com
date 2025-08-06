import ErrorCard from "@/app/(frontend)/(website)/_components/ErrorCard";
import Header from "../../components/Header";
import { getTransformedBatches } from "./serverActions/getTransformedBatches";
import EnrollmentPage from "./components/EnrollmentForm";
import { getStudent } from "./serverActions/getStudent";


export default async function Page({ searchParams }: { searchParams: Promise<{ batches?: string[] | string }> }) {
  try {
    const { batches: batchIds } = await searchParams
    const batches = await getTransformedBatches(batchIds);
    const { user, student } = await getStudent()

    if (!batches.length) {
      return (
        <div className="text-center py-12" >
          <h3 className="text-xl font-medium">No courses available for enrollment at this time</h3>
          <p className="text-muted-foreground mt-2">Please check back later for new offerings</p>
        </div >
      )
    }

    if (!user || !student) {
      return (
        <ErrorCard error="You are not authorized to view this page. Your session is expired or you are not logged in. Try Logging in again" />
      )
    }

    return (
      <>
        <Header title="Join Courses" subtitle="Current offerings open for registration" />
        <EnrollmentPage batches={batches} user={user} student={student} />
      </>
    );
  } catch (error) {
    return <ErrorCard error={error} />
  }
}