"use client";

import { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ReactPlayer from "react-player";
import Loading from "@/app/(frontend)/(auth)/lms/components/Loading";
import getUserEnrolledCourses from '@/app/(frontend)/(auth)/lms/(dashboard)/courses/getUserEnrolledCourses';

type TCourse = Awaited<ReturnType<typeof getUserEnrolledCourses>>[number]

const Course = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<TCourse | null>(null);
  const [currentLecture, setCurrentLecture] = useState<any>(null);

  // useEffect(() => {
  //   fetchCourseData();
  // }, [params.courseId, params.lectureId]);

  // const fetchCourseData = async () => {
  //   try {
  //     setIsLoading(true);
  //     const courses = await getUserEnrolledCourses();
  //     const currentCourse = courses.find(c => c.id.toString() === params.courseId);
  //     if (currentCourse) {
  //       setCourse(currentCourse);
  //       const lecture = findLecture(currentCourse, params.lectureId as string);
  //       setCurrentLecture(lecture);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching course data:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const findLecture = (course: TCourse, lectureId: string) => {
  //   if (!course.modules) return null;
  //   for (const courseModule of course.modules as any[]) {
  //     const lecture = courseModule.lectures?.find((l: any) => l.id.toString() === lectureId);
  //     if (lecture) return { ...lecture, moduleTitle: courseModule.title };
  //   }
  //   return null;
  // };

  if (isLoading) return <Loading />;
  if (!course || !currentLecture) return <div>Course or lecture not found</div>;

  return (
    <div className="course">
      <div className="course__container">
        <div className="course__breadcrumb">
          <div className="course__path">
            {course.title} / {currentLecture.moduleTitle} /{" "}
            <span className="course__current-chapter">
              {currentLecture.topic}
            </span>
          </div>
          <h2 className="course__title">{currentLecture.topic}</h2>
          {currentLecture.teacher && (
            <div className="course__header">
              <div className="course__instructor">
                <Avatar className="course__avatar">
                  <AvatarImage alt={currentLecture.teacher.name} src={currentLecture.teacher.avatar} />
                  <AvatarFallback className="course__avatar-fallback">
                    {currentLecture.teacher.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="course__instructor-name">
                  {currentLecture.teacher.name}
                </span>
              </div>
            </div>
          )}
        </div>

        <Card className="course__video">
          <CardContent className="course__video-container">
            {currentLecture.videoUrl ? (
              <ReactPlayer
                ref={playerRef}
                url={currentLecture.videoUrl}
                controls
                width="100%"
                height="100%"
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                    },
                  },
                }}
              />
            ) : (
              <div className="course__no-video">
                No video available for this lecture.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="course__content">
          <Tabs defaultValue="Notes" className="course__tabs">
            <TabsList className="course__tabs-list">
              <TabsTrigger className="course__tab" value="Notes">
                Notes
              </TabsTrigger>
              <TabsTrigger className="course__tab" value="Resources">
                Resources
              </TabsTrigger>
              <TabsTrigger className="course__tab" value="Quiz">
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent className="course__tab-content" value="Notes">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Notes Content</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                  {currentLecture.notes ? JSON.stringify(currentLecture.notes) : 'No notes available'}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className="course__tab-content" value="Resources">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Resources Content</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                  {currentLecture.files ? JSON.stringify(currentLecture.files) : 'No resources available'}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className="course__tab-content" value="Quiz">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Quiz Content</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                  Quiz functionality not implemented yet
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {currentLecture.teacher && (
            <Card className="course__instructor-card">
              <CardContent className="course__instructor-info">
                <div className="course__instructor-header">
                  <Avatar className="course__instructor-avatar">
                    <AvatarImage alt={currentLecture.teacher.name} src={currentLecture.teacher.avatar} />
                    <AvatarFallback className="course__instructor-avatar-fallback">
                      {currentLecture.teacher.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="course__instructor-details">
                    <h4 className="course__instructor-name">
                      {currentLecture.teacher.name}
                    </h4>
                    <p className="course__instructor-title">Instructor</p>
                  </div>
                </div>
                <div className="course__instructor-bio">
                  <p>
                    {currentLecture.teacher.bio || "No bio available for this instructor."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Course;

