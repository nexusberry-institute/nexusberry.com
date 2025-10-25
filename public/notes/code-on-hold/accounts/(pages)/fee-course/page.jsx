"use client";
import React, { useState } from "react";
import { Col, Row } from "antd";
import StudentsTable from "@accounts/_components/Student/StudentTable";
import StudentHeader from "@accounts/_components/Student/StudentHeader";
// import ActiveCoursesList from "@accounts/_components/Student/ActiveCoursesList";
import useGetStudentsApi from "@accounts/_hooks/Student/useGetStudentsApi";

const FeeTrainingCourse = () => {
  const [clickedItem, setClickedItem] = useState(null);
  const [filters, setFilters] = useState({
    course: "",
    search: {
      type: "",
      value: "",
    },
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 200,
  });

  const handlePagination = ({ page, pageSize }) => {
    setPagination({ page, pageSize });
  };

  const { students, apiPagination, isLoading, isError, error } =
    useGetStudentsApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      filters,
    });

  const handleFiltersChange = ({ name, value }) => {
    if (filters[name] === "search") {
      setFilters({ ...filters, [name]: value, course: "" });
    } else {
      setFilters({...filters, [name]: value, search: {type: "", value: ""} });
    }
  };

  return (
    <>
      <StudentHeader
        total={apiPagination?.total}
        filters={filters}
        handleFiltersChange={handleFiltersChange}
      />

      <Row gutter={5} style={{ margin: "16px" }}>
        <Col span={24}>
          <StudentsTable
            students={students}
            course={filters.course}
            clickedItem={clickedItem}
            isLoading={isLoading}
            isError={isError}
            error={error}
            apiPagination={apiPagination}
            handlePagination={handlePagination}
            pagination={pagination}
          />
        </Col>
      </Row>
    </>
  );
};

export default FeeTrainingCourse;
