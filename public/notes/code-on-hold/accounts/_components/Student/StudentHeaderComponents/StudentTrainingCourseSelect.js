"use client"
import React, { useState } from "react";
import { Col, Row, Checkbox } from "antd";
import { Select, Spin } from "antd";
//
import useGetTrainingCoursesApi from "@accounts/_hooks/Course/useGetTrainingCoursesApi";

const { Option } = Select;

const StudentTrainingCourseSelect = ({
  total,
  selectedCourse,
  handleFiltersChange,
  // active
}) => {
  const [active, setActive] = useState(true);
  const { trainingCourses, isLoading, isError, error } 
    = useGetTrainingCoursesApi(active);

  const handleCourseChange = (value) => {
    handleFiltersChange({ name: "course", value });
  };

  const onChangeActive = (bool) => {
    setActive(bool);
    handleFiltersChange({ name: "course", value: "" });
  }

  if(isError)
    console.log(error);

  return (
    <>
    <Select
      loading={isLoading}
      notFoundContent={isLoading ? <Spin size="small" /> : null}
      size="small"
      placeholder="Courses"
      value={selectedCourse}
      onChange={handleCourseChange}
      style={{ width: "100%" }}
      popupMatchSelectWidth={true}
    >
      {/* <Option value="all">All</Option> */}
      {trainingCourses?.map((course) => (
        <Option key={course.id} value={course.id}>
          {course.sr}. {course.nick} ({course.students})
        </Option>
      ))}
    </Select>

    <strong
      style={{
        color: "black",
        alignContent: "center",
      }}
    >
      Active:
    </strong>
    <Checkbox checked={active} onChange={e => onChangeActive(e.target.checked)} />

    <b>Total={
      trainingCourses?.reduce((sum, c) => sum + c.students, 0)
    }</b>
    </>
  );
};

export default StudentTrainingCourseSelect;
