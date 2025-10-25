'use client'

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useRouter, useParams } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import getUserEnrolledCourses from '@/app/(frontend)/(auth)/lms/(dashboard)/courses/getUserEnrolledCourses';
import { TrainingCourse as Course } from "@/payload-types";

const LecturesSidebar = () => {
  const router = useRouter();
  const params = useParams();
  const { setOpen } = useSidebar();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [course, setCourse] = useState<Omit<Course, "createdAt" | "updatedAt" | "slug"> | null>(null);

  // useEffect(() => {
  //   setOpen(false);
  //   fetchCourseData();
  // }, [params.courseId, setOpen]);

  // const fetchCourseData = async () => {
  //   try {
  //     const courses = await getUserEnrolledCourses();
  //     const currentCourse = courses.find(c => c.id.toString() === params.courseId);
  //     if (currentCourse) {
  //       setCourse(currentCourse);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching course data:', error);
  //   }
  // };

  const toggleModule = (moduleTitle: string) => {
    setExpandedModules((prevModules) =>
      prevModules.includes(moduleTitle)
        ? prevModules.filter((title) => title !== moduleTitle)
        : [...prevModules, moduleTitle]
    );
  };

  const handleLectureClick = (moduleId: string, lectureId: string) => {
    router.push(`/lms/courses/${params.courseId}/lectures/${lectureId}`, {
      scroll: false,
    });
  };

  if (!course) return null;

  return (
    <div ref={sidebarRef} className="lectures-sidebar">
      <div className="lectures-sidebar__header">
        <h2 className="lectures-sidebar__title">{course.title}</h2>
        <hr className="lectures-sidebar__divider" />
      </div>
      {course.modules?.map((module: any, index) => (
        <Module
          key={module.id}
          module={module}
          index={index}
          expandedModules={expandedModules}
          toggleModule={toggleModule}
          handleLectureClick={handleLectureClick}
        />
      ))}
    </div>
  );
};

const Module = ({
  module,
  index,
  expandedModules,
  toggleModule,
  handleLectureClick,
}: {
  module: any;
  index: number;
  expandedModules: string[];
  toggleModule: (moduleTitle: string) => void;
  handleLectureClick: (id: string, lectureId: string) => void;
}) => {
  const isExpanded = expandedModules.includes(module.title);

  return (
    <div className="lectures-sidebar__module">
      <div
        onClick={() => toggleModule(module.title)}
        className="lectures-sidebar__module-header"
      >
        <div className="lectures-sidebar__module-title-wrapper">
          <p className="lectures-sidebar__module-number">
            module 0{index + 1}
          </p>
          {isExpanded ? (
            <ChevronUp className="lectures-sidebar__chevron" />
          ) : (
            <ChevronDown className="lectures-sidebar__chevron" />
          )}
        </div>
        <h3 className="lectures-sidebar__module-title">
          {module.title}
        </h3>
      </div>
      <hr className="lectures-sidebar__divider" />

      {isExpanded && (
        <div className="lectures-sidebar__module-content">
          <LecturesList
            module={module}
            handleLectureClick={handleLectureClick}
          />
        </div>
      )}
      <hr className="lectures-sidebar__divider" />
    </div>
  );
};

const LecturesList = ({
  module,
  handleLectureClick,
}: {
  module: any;
  handleLectureClick: (id: string, lectureId: string) => void;
}) => (
  <ul className="lectures-sidebar__lectures">
    {module.lectures.map((lecture: any, index: number) => (
      <Lecture
        key={lecture.id}
        lecture={lecture}
        index={index}
        id={module.id}
        handleLectureClick={handleLectureClick}
      />
    ))}
  </ul>
);

const Lecture = ({
  lecture,
  index,
  id,
  handleLectureClick,
}: {
  lecture: any;
  index: number;
  id: string;
  handleLectureClick: (id: string, lectureId: string) => void;
}) => (
  <li
    className="lectures-sidebar__lecture"
    onClick={() => handleLectureClick(id, lecture.id)}
  >
    <div className="lectures-sidebar__lecture-number">
      {index + 1}
    </div>
    <span className="lectures-sidebar__lecture-title">
      {lecture.topic}
    </span>
    {lecture.files && (
      <FileText className="lectures-sidebar__text-icon" />
    )}
  </li>
);

export default LecturesSidebar;

