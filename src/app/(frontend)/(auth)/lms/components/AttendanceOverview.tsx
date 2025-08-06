import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Course } from '../types/types.md';

interface AttendanceOverviewProps {
  course: Course;
}

const AttendanceOverview: React.FC<AttendanceOverviewProps> = ({ course }) => {

  const sortedAttendanceRecord = useMemo(() => {
    return [...course.attendanceRecord].sort((a, b) => new Date(a.date || '').getTime() - new Date(b.date || '').getTime());
  }, [course.attendanceRecord]);

  return (
    <Card className="bg-white border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white-50">Attendance Overview: {course.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex items-end space-x-1 overflow-x-auto pb-4 hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sortedAttendanceRecord.map((record, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              title={`${record.date}: ${record.lecture}\n${record.attended ? 'Present' : 'Absent'}`}
            >
              <div
                className={`w-3 rounded-sm transition-all duration-300 ${record.attended ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                style={{ height: `${record.attended ? '40px' : '20px'}` }}
              />
              <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                {record.date ? new Date(record.date).getDate() : ''}
              </span>
            </div>
          ))}        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>Course Start</span>
          <span>Current</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceOverview;

