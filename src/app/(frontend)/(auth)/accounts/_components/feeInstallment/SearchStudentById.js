import React from "react";
import { Input, Col, Row, Select } from "antd";

const { Search } = Input;

const SearchByIdForm = ({
  id,
  student = {},
  isLoading,
  onChangeSearchId,
  onChangeCourse,
}) => {

  const onSearch = (value) => {
    onChangeSearchId(value);
  };

  const options =
    student.trainingCourses?.map((course) => ({
      value: course.id,
      label: course.nick || course.id,
      disabled: !course.active,
    })) ?? [];

  return (
    <>
      <Row align={"middle"}>
        <Col span={2}>
          <b style={{ marginRight: "6px" }}>Id of Student: </b>
        </Col>
        <Col span={22}>
          <Search
            loading={isLoading}
            placeholder="input"
            onSearch={onSearch}
            allowClear
            enterButton
            style={{ width: "25%"}}
          />
        </Col>
      </Row>

      {student && (
        <>
          <h3>Student Info:</h3>
          <Row style={{ marginTop: "0px" }}>
            <Col span={8}>
              <b style={{ marginLeft: "20px", marginRight: "6px", color: "gray" }}>ID:</b>
              <span>{student.id || "No id found"}</span>
            </Col>
          </Row>
          <Row style={{ marginTop: "5px" }}>
            <Col span={8}>
              <b style={{ marginLeft: "20px", marginRight: "6px", color: "gray" }}>Name:</b>
              <span>{student.name || "No Data is here"}</span>
            </Col>
          </Row>
          <Row style={{ marginTop: "5px" }}>
            <Col span={8}>
              <b style={{ marginLeft: "20px", marginRight: "6px", color: "gray" }}>Mobile:</b>
              <span>{student.mobile || "No Data is here"} </span>
            </Col>
          </Row>
          <Row style={{ marginTop: "5px" }}>
            <Col span={8}>
              <b style={{ marginLeft: "20px", marginRight: "6px", color: "gray" }}>Email :</b>
              <span>{student.email || "No Data is here"}</span>
            </Col>
          </Row>
          <Row align={"middle"}>
            <Col span={2}>
              <h3>Select Course:</h3>
            </Col>
            <Col span={22}>
              <div label="Training Courses Batch">
                <Select
                  allowClear={true}
                  placeholder="select your course"
                  style={{ width: "25%"}}
                  placement="bottomLeft"

                  onChange={onChangeCourse}
                  options={options}
                />
              </div>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default SearchByIdForm;
