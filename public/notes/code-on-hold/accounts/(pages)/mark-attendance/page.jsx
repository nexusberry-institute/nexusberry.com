"use client";
import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
import { usePathname, useRouter } from "next/navigation";
import { Spin, Button, message } from "antd";
import MarkAttendanceNav from "./_components/MarkAttendanceNav";
import MarkAttendanceDetail from "./_components/MarkAttendanceDetail";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
//
import useGetTrainingCoursesApi from "@accounts/_hooks/Course/useGetTrainingCoursesApi";
import { usePostAttendanceApi } from "@accounts/_hooks/Attendence/usePostAttendanceApi";

const MarkAttendance = () => {
  const { trainingCourse } = useGetTrainingCoursesApi();
  const trainingCoursesData = useGetTrainingCoursesApi();
  const { detailUrl, navUrl } = usePostAttendanceApi();
  const initialStudentAttendance = {};
  const [studentAttendance, setStudentAttendance] = useState(
    initialStudentAttendance
  );
  // const location = useLocation();
  const location = usePathname();
  // const navigate = useNavigate();
  const navigate = useRouter();
  const params = new URLSearchParams(location.search);
  const nick = params.get("course-nick");

  const [formData, setFormData] = useState({
    trainingCourse: nick,
    date: null,
    type: "all",
    medium: "all",
  });

  const filteredStudents = trainingCoursesData?.trainingCourse
    ?.filter((student) => student.nick === nick)
    .map((student) => student.students?.data);

  const getrainingCourseId = trainingCourse
    ? trainingCourse.map((item) => {
        return {
          id: item.id,
          nick: item.nick,
        };
      })
    : [];

  const data =
    filteredStudents?.[0]?.map((student) => ({
      key: student.id,
      id: student.id,
      email: student?.attributes?.email,
      name: student?.attributes?.name,
      attendance: "Present",
    })) || [];

  const selectedCourse = getrainingCourseId.find(
    (course) => course.nick === formData.trainingCourse
  );

  const handleSubmit = async () => {
    try {
      if (selectedCourse) {
        const courseId = selectedCourse.id;

        // Post form data
        const formResponse = await axios.post(navUrl, {
          data: {
            date: formData.date,
            trainingCourse: courseId,
            type: formData.type,
            medium: formData.medium,
          },
        });

        if (formResponse.data && formResponse.data.data.id) {
          const formDataId = formResponse.data.data.id;

          // Now that you have the formDataId, proceed to post student data
          const promises = data.map(async (student) => {
            const id = parseInt(student.id);
            const status = String(studentAttendance[student.id]);
            const studentName = student.name;

            // Include courseAttendance with the formDataId
            return axios.post(detailUrl, {
              data: {
                student: id,
                status: status,
                courseAttendance: formDataId,
                medium: formData.medium,
              },
            });
          });

          // Wait for all promises to resolve
          const responses = await Promise.all(promises);

          responses.forEach((response, index) => {
            const studentName = data[index].name;
          });

          // console.log("All data has been successfully posted.");

          message.success("Attendence Marked Successfully!");
          navigate.push("/teacher-dashboard");
        }
      }
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Mark Attendence: {nick}</h2>
      <p style={{ textAlign: "center", marginBottom: "35px" }}>
        Number of Total Students: {data?.length}
      </p>
      <MarkAttendanceNav setFormData={setFormData} formData={formData} />

      <div
        style={{
          marginRight: "10px",
          marginLeft: "10px",
        }}
      >
        {trainingCoursesData.isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
            }}
          >
            <Spin />
          </div>
        ) : (
          <>
            <MarkAttendanceDetail
              setStudentAttendance={setStudentAttendance}
              studentAttendance={studentAttendance}
              initialStudentAttendance={initialStudentAttendance}
              filteredStudents={filteredStudents}
              data={data}
            />
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MarkAttendance;
