import React from "react";
import { Select, Space } from "antd";
import useGetTrainingCoursesApi from "@accounts/_hooks/Course/useGetTrainingCoursesApi";

const { Option } = Select;

const CourseSelectFilter = ({
  selectedCourse,
  handleFiltersChange,
  setPagination,
}) => {
  const { trainingCourse, isLoading, isError, error } =
    useGetTrainingCoursesApi();

  const handleCourseChange = (value) => {
    let name = "course";

    if (value) {
      handleFiltersChange({ name, value });
    } else {
      let value = "all";
      handleFiltersChange({ name, value });
    }
  };

  // let view;
  // if (isLoading) {
  //   view = <Spin />;
  // } else if (isError) {
  //   view = <p>{error.message}</p>;
  // } else {
  //   view = (
  //     <Select
  //       allowClear
  //       placeholder="All"
  //       value={selectedCourse}
  //       onChange={handleCourseChange}
  //       style={{ width: 150 }}
  //       popupMatchSelectWidth={false}
  //     >
  //       <Option value="all">All</Option>
  //       {trainingCourse?.map((course) => (
  //         <Option key={course.id} value={course.nick}>
  //           {course.nick}
  //         </Option>
  //       ))}
  //     </Select>
  //   );
  // }

  return (
    <Space wrap style={{ marginTop: "-15px" }}>
      <h4>Course: </h4>
      <Select
        allowClear
        placeholder="All"
        value={selectedCourse}
        onChange={handleCourseChange}
        style={{ width: 150 }}
        popupMatchSelectWidth={false}
      >
        <Option value="all">All</Option>
        {trainingCourse?.map((course) => (
          <Option key={course.id} value={course.nick}>
            {course.nick}
          </Option>
        ))}
      </Select>
      {/* {view} */}
    </Space>
  );
};

export default CourseSelectFilter;
