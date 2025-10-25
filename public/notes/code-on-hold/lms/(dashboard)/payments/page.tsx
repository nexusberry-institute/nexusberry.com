import { getStudentEnrollments } from "./serverActions/getStudentEnrollments";
import Header from "../../components/Header";
import FeeCard from "./components/FeeCard";
import { headers as getHeaders } from "next/headers"

export default async function PaymentsPage() {
  const headers = await getHeaders()
  const enrollments = await getStudentEnrollments(headers);

  return (
    <div className="space-y-8 p-4">
      <Header
        title="Fees & Payments"
        subtitle="Access your fee records and manage future payments"
      />

      {enrollments.length ?
        enrollments.map(enrollment => (
          <div key={enrollment.id} className="space-y-6 flex flex-col">
            <h2 className="text-xl font-semibold text-[#63b3ed]">
              {enrollment["training-course"].title}
            </h2>
            {
              enrollment.batchEnrollments?.map((batchEnrollment) => (
                <FeeCard key={batchEnrollment.id} enrollment={enrollment} batchEnrollment={batchEnrollment} />
              ))
            }
          </div>
        )) : (
          <div>
            <p>You are not enrolled in any courses yet. Enroll in a course to see payments</p>
          </div>
        )
      }
    </div>
  );
}
