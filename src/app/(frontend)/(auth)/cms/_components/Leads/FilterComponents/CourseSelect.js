import { Select } from "antd";
import UseGetCoursesApi from "@cms/_hooks/leads/UseGetCoursesApi";
const { Option } = Select;

const CourseSelect = ({ selectedCourse, handleFiltersChange }) => {
  const { courses } = UseGetCoursesApi();
  // console.log("course: ", courses);

  const handleCourseChange = (value) => {
    let name = "course";

    if (value) {
      handleFiltersChange({ name, value });
    } else {
      let value = "all";
      handleFiltersChange({ name, value });
    }
  };

  return (
    <Select
      allowClear
      size="small"
      placeholder="Courses"
      value={selectedCourse}
      onChange={handleCourseChange}
      style={{ width: "100%" }}
      // dropdownStyle={{ width: "15%" }}
      popupMatchSelectWidth={false}
    >
      <Option value="all">All</Option>
      {courses?.map((course) => (
        <Option key={course.id} value={course.slug}>
          {course.nick}
        </Option>
      ))}
    </Select>
  );
};

export default CourseSelect;
