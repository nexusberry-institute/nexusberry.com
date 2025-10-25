"use client"
import React, { useState } from "react";
import { Col, Row, Select, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
//
import useGetTrainingCoursesApi from "@accounts/_hooks/Course/useGetTrainingCoursesApi";

const { Option } = Select;

const FilterCertificate = ({
  searchType,
  setSearchType,
  handleSelectedCourse,
  selectedCourse,
  handleStatus,
  status,
  handleSearch,
}) => {
  const { trainingCourse } = useGetTrainingCoursesApi();
  const [inputValue, setInputValue] = useState("");

  const handleTypeChange = (value) => {
    setSearchType(value);
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (!value) {
      handleSearch(""); // Reset the search value when the input is cleared
    }
  };

  const handleSearchClick = () => {
    handleSearch(inputValue);
  };

  const placeholders = {
    id: "Enter Student ID",
    name: "Enter Student Name",
    mobile: "Enter Student Mobile",
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginRight: "10px",
          marginLeft: "10px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "15px", flex: 1 }}>
          Students Certificate
        </h1>
      </div>

      <div
        style={{
          backgroundColor: "white",
          margin: "0 10px 10px 10px",
        }}
      >
        <Row
          align={"middle"}
          justify="center"
          style={{
            marginLeft: "15px",
            paddingTop: "15px",
            paddingBottom: "15px",
            marginTop: "15px",
          }}
        >
          <Col span={2}>
            <strong>Course:</strong>
          </Col>
          <Col span={5}>
            <Select
              allowClear
              defaultValue="all"
              style={{ width: "100%", marginLeft: "-40px" }}
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
            <strong style={{ marginLeft: "10px" }}>Status:</strong>
          </Col>
          <Col span={3}>
            <Select
              allowClear
              defaultValue="0"
              style={{ width: "100%", marginLeft: "-35px" }}
              onChange={handleStatus}
              value={status}
            >
              <Option value="0" disabled>
                Status
              </Option>
              <Option value="requested">Requested</Option>
              <Option value="pending">Pending</Option>
              <Option value="sent">Sent</Option>
            </Select>
          </Col>

          <Col span={3}>
            <strong style={{ marginLeft: "10px" }}>Search By:</strong>
          </Col>
          <Col span={7}>
            <Input
              id="searchInput"
              style={{ width: "396px", marginLeft: "-60px" }}
              placeholder={placeholders[searchType] || "Enter Student ID"}
              size="middle"
              allowClear
              prefix={<SearchOutlined />}
              addonBefore={
                <Select
                  value={searchType}
                  onChange={handleTypeChange}
                  style={{ width: "150px" }}
                >
                  <Option value="studentId">Student ID</Option>
                  <Option value="name">Student Name</Option>
                  <Option value="mobile">Student Mobile</Option>
                </Select>
              }
              onChange={handleInputChange}
              onPressEnter={handleSearchClick}
            />
          </Col>
          <Col span={2}>
            <Button type="primary" onClick={handleSearchClick} size="middle">
              Search
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default FilterCertificate;
