
import StatCards from '../../../components/StatCards';
import CourseAccordion from '../../../components/CourseAccordion';
import AttendanceOverview from '../../../components/AttendanceOverview';

import { studentData } from '../../../data/mockData';
import { Course } from '../../../types/types.md';


export default function OverviewTab({ currentCourse, setSelectedCourse }: {
  currentCourse: Course, setSelectedCourse: (id: string) => void;
}) {
  return (
    <>
      <StatCards course={currentCourse} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <CourseAccordion
            courses={studentData.courses}
            setSelectedCourse={setSelectedCourse}
          />
        </div>
        <div className="md:col-span-2">
          <AttendanceOverview course={currentCourse} />
        </div>
      </div>
    </>
  );
}