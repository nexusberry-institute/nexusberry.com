import { Form, Select } from "antd";
import UseGetCoursesApi from "@cms/_hooks/leads/UseGetCoursesApi";
const { Option } = Select;

const CourseSelectComponent = ({ selectedCourse }) => {
  const { courses } = UseGetCoursesApi();

  return (
    <Form.Item label="Course" name="webCourse">
      <Select
        allowClear
        size="small"
        placeholder="Courses"
        style={{ width: "100%" }}
        popupMatchSelectWidth={false}
      >
        <Option value="all">All</Option>
        {courses?.map((course) => (
          <Option key={course.id} value={course.id}>
            {course.nick}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default CourseSelectComponent;
