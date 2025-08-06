import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, UserCheck, BookOpen } from 'lucide-react';
import { Course } from '../types/types.md';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

interface StatCardsProps {
  course: Course;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <Card className="bg-gray-800 border-none">
    <CardContent className="flex items-center p-6">
      <div className="mr-4 bg-primary/20 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </CardContent>
  </Card>
);


const StatCards: React.FC<StatCardsProps> = ({ course }) => {
  const [attendanceData, setAttendanceData] = useState({
    totalLectures: 0,
    attendedLectures: 0,
    attendanceRate: '0%'
  });

  useEffect(() => {
    const totalLectures = course.attendanceRecord.length;
    const attendedLectures = course.attendanceRecord.filter(record => record.attended).length;
    const attendanceRate = `${Math.round((attendedLectures / totalLectures) * 100)}%`;

    setAttendanceData({ totalLectures, attendedLectures, attendanceRate });
  }, [course]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Lectures"
        value={attendanceData.totalLectures}
        icon={<Clock className="text-gray-400" />}
      />
      <StatCard
        title="Lectures Attended"
        value={attendanceData.attendedLectures}
        icon={<UserCheck className="text-gray-400" />}
      />
      <StatCard
        title="Attendance Rate"
        value={attendanceData.attendanceRate}
        icon={<BookOpen className="text-gray-400" />}
      />
    </div>
  );
};

export default StatCards;

