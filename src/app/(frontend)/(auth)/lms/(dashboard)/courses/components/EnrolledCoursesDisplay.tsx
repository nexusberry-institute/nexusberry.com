import getUserEnrolledCourses from '../getUserEnrolledCourses';

import CourseCard from './CourseCard';

type CoursesType = Awaited<ReturnType<typeof getUserEnrolledCourses>>

export const EnrolledCoursesDisplay: React.FC<{ courses: CoursesType }> = ({ courses }) => {
  // Group enrollments by status
  const continuingEnrollments = courses.filter(e => e.enrollmentStatus === "CONTINUE");
  const completedEnrollments = courses.filter(e => e.enrollmentStatus === "COMPLETED");

  return (
    <div className="space-y-12">
      {/* Continuing Courses Section */}
      {continuingEnrollments.length > 0 && (
        <section>
          <div className="flex items-center mb-6">
            <div className="h-8 w-2 bg-primary rounded-full mr-3"></div>
            <h2 className="text-2xl text-[#6e6e6e] font-bold">Continue Learning</h2>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {continuingEnrollments.map((course, i) => (
              <CourseCard key={i} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Completed Courses Section */}
      {completedEnrollments.length > 0 && (
        <section>
          <div className="flex items-center mb-6">
            <div className="h-8 w-2 bg-green-500 rounded-full mr-3"></div>
            <h2 className="text-2xl text-[#6e6e6e] font-bold">Completed Courses</h2>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {completedEnrollments.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Show message if no enrollments */}
      {courses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
        </div>
      )}
    </div>
  );
};
