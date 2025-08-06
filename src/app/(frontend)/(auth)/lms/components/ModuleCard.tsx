// 'use client'

// import {
//   Card,
//   CardContent,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { TrainingCourse as Course, Module } from "@/payload-types";
// import { useRouter } from "next/navigation";
// import getUserEnrolledCourses from "../_components/getUserEnrolledCourses";

// interface ModuleCardProps {
//   batchEnrollment: NonNullable<Awaited<ReturnType<typeof getUserEnrolledCourses>>[number]["batchEnrollments"]>[number];
//   course: Partial<Course>;
// }

// const ModuleCard: React.FC<ModuleCardProps> = ({ batchEnrollment, course }) => {
//   const router = useRouter();

//   const handleGoToCourse = (course: Partial<Course>, module: any) => {
//     if (module.lectures && module.lectures.length > 0) {
//       const firstLecture = module.lectures[0];
//       if (typeof firstLecture === 'object' && firstLecture !== null) {
//         router.push(
//           `/lms/courses/${course.id}/lectures/${firstLecture.id}`,
//           {
//             scroll: false,
//           }
//         );
//       }
//     }
//   };

//   return (
//     <Card className="course-card group" onClick={() => handleGoToCourse(course, batchEnrollment)}>
//       <CardContent className="course-card__content">
//         <CardTitle className="course-card__title">
//           {batchEnrollment?.batch.slug}
//         </CardTitle>
//         <p className="text-sm text-customgreys-dirtyGrey mb-2 line-clamp-2">
//           {batchEnrollment?.batch.medium}
//         </p>
//         <CardFooter className="course-card__footer">
//           <div className="course-card__category">
//             {batchEnrollment?.modules?.length} {batchEnrollment?.modules?.length === 1 ? 'Lecture' : 'Lectures'}
//           </div>
//         </CardFooter>
//       </CardContent>
//     </Card>
//   );
// };

// export default ModuleCard;

