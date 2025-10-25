"use client"

import React, { useState } from 'react';
import ProfileCard from '../../../components/ProfileCard';
import AttendanceRecord from './AttendanceRecord'
import { studentData } from '../../../data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalInfoTab from './PersonalInfoTab';
import SecurityTab from './SecurityTab';
import { transformStudent } from '../actions/transformStudent';
import OverviewTab from './OverviewTab';
import { useSearchParams } from 'next/navigation';
import { useLMSAuth } from '../../../lmsAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';

const StudentProfile = ({ student }: { student: ReturnType<typeof transformStudent> }) => {

  const searchParams = useSearchParams()
  const { hasCompletedProfile } = useLMSAuth()

  const [selectedCourse, setSelectedCourse] = useState(studentData.courses[0]?.id);

  const currentCourse = studentData.courses.find(course => course.id === selectedCourse)!;

  return (
    <div className="space-y-6 p-6">
      <ProfileCard student={student} />

      <Tabs defaultValue={searchParams.get("tab") || "overview"} className="w-full">

        <TabsList className="relative flex w-full gap-2 justify-start overflow-x-auto *:data-[state=active]:bg-input/50">
          {hasCompletedProfile || <div className='loadingBlock' />}
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="security">Security & Password</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewTab currentCourse={currentCourse} setSelectedCourse={setSelectedCourse} />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceRecord course={currentCourse} />
        </TabsContent>

        <TabsContent value="personal">
          {hasCompletedProfile || <Alert variant={"destructive"}>
            <AlertDescription>
              <p>Navigation is restricted until you complete your profile</p>
              <p>Please fill in all required information to access other sections.</p>
            </AlertDescription>
          </Alert>
          }
          <PersonalInfoTab student={student} />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab student={student} />
        </TabsContent>


      </Tabs>
    </div>
  );
};

export default StudentProfile;

