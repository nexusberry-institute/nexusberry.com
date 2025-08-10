import getUserEnrolledCourses from './getUserEnrolledCourses'
import Header from '../../components/Header';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EnrolledCoursesDisplay } from './components/EnrolledCoursesDisplay';


export default async function CoursesPage() {
  try {
    const courses = await getUserEnrolledCourses();

    let batchString = ''
    courses.forEach(course => {
      course.batchEnrollments?.forEach(be => {
        if (be?.batch.id) {
          batchString = batchString.concat(`batches=${be.batch.id}&`)
        }
      })
    })

    return (
      <div className="user-courses">
        <Header
          title="My Courses"
          subtitle="View your enrolled courses"
          rightElement={
            <Button variant="default">
              <GraduationCap className="mr-2 h-4 w-4" />
              <Link href={`/lms/enroll-now?${batchString}`} className="flex items-center">
                Enroll in a course
              </Link>
            </Button>
          }
        />
        <EnrolledCoursesDisplay courses={courses} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching courses:', error);
    return <div>An error occurred while fetching your courses. Please try again later.</div>;
  }
}

