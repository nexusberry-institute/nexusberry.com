import React from "react";
import { Col, Row, Radio, Select } from "antd";
//
import useGetTrainingCoursesApi from "@accounts/_hooks/Course/useGetTrainingCoursesApi";
import useGetTeachersName from "@accounts/_hooks/Teacher/useGetTeachersName";

const { Option } = Select;

const FilterSchedule = ({
  onSelectDay,
  onSelectRoom,
  handleFiltersChange,
  handleTeacherFilter,
  selectedTeacher,
  selectedCourse,
  selectedRoom,
}) => {
  const { trainingCourse } = useGetTrainingCoursesApi();
  const { data } = useGetTeachersName();

  const handleSelectDay = (e) => {
    onSelectDay(e.target.value);
  };

  const handleSelectRoom = (value) => {
    if (value === undefined) {
      value = "0";
    }
    onSelectRoom(value);
  };

  const handleSelectedCourse = (value) => {
    if (value === undefined) {
      value = "all";
    }
    handleFiltersChange({ name: "course", value });
  };

  const handleSelectedTeacher = (value) => {
    if (value === undefined) {
      value = "all";
    }
    handleTeacherFilter({ name: "teacher", value });
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          margin: "0 10px 10px 10px",
        }}
      >
        <Row
          align={"middle"}
          style={{
            marginLeft: "15px",
            paddingTop: "15px",
            paddingBottom: "15px",
            marginTop: "15px",
          }}
        >
          <Col span={1}>
            <strong>Days</strong>
          </Col>
          <Col span={11}>
            <Radio.Group onChange={handleSelectDay} defaultValue="all">
              <Radio value="all">All</Radio>
              <Radio value="Monday">Mon</Radio>
              <Radio value="Tuesday">Tue</Radio>
              <Radio value="Wednesday">Wed</Radio>
              <Radio value="Thursday">Thu</Radio>
              <Radio value="Friday">Fri</Radio>
              <Radio value="Saturday">Sat</Radio>
              <Radio value="Sunday">Sun</Radio>
            </Radio.Group>
          </Col>

          <Col span={1}>
            <strong style={{ marginLeft: "-10px" }}>Teachers</strong>
          </Col>
          <Col span={3}>
            <Select
              allowClear
              defaultValue="all"
              style={{ width: "100%", marginLeft: "3px" }}
              onChange={handleSelectedTeacher}
              value={selectedTeacher}
            >
              <Option value="all">All</Option>
              {data?.map((teacher, index) => (
                <Option key={index} value={teacher?.attributes?.name}>
                  {teacher?.attributes?.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={1}>
            <strong style={{ marginLeft: "18px" }}>Batches</strong>
          </Col>
          <Col span={4}>
            <Select
              allowClear
              defaultValue="all"
              style={{ width: "100%", marginLeft: "25px" }}
              onChange={handleSelectedCourse}
              value={selectedCourse}
            >
              <Option value="all">All</Option>
              {trainingCourse?.map((course) => (
                <Option key={course.id} value={course.nick}>
                  {course.nick}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={2}>
            <Select
              allowClear
              defaultValue="0"
              style={{ width: "100%", marginLeft: "35px" }}
              onChange={handleSelectRoom}
              value={selectedRoom}
            >
              <Option value="0">All Room</Option>
              <Option value="1">Room 1</Option>
              <Option value="2">Room 2</Option>
              <Option value="5">Room 5</Option>
              <Option value="online">Online</Option>
            </Select>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FilterSchedule;
