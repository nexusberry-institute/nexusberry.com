"use client";
import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import { Badge, Col, List, Row, Spin } from "antd";
import {
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
//
import { formatDate } from "@accounts/_lib/formatDate";
//
import useGetTrainingCoursesApi from "@accounts/_hooks/Course/useGetTrainingCoursesApi";

const ActiveCourses = ({ clickedItem }) => {
  // const navigate = useNavigate();
  const navigate = useRouter();
  const trainingCourses = useGetTrainingCoursesApi();

  let totalStudents = 0;
  trainingCourses?.trainingCourse?.map((item) => {
    totalStudents += item?.students?.data?.length || 0;
  });

  const [sortType, setSortType] = useState(null);

  const handleSort = (type) => {
    setSortType(type);
  };

  const sortedData = trainingCourses?.trainingCourse?.slice().sort((a, b) => {
    if (sortType === "asc") {
      return new Date(a.startDate) - new Date(b.startDate);
    } else if (sortType === "desc") {
      return new Date(b.startDate) - new Date(a.startDate);
    }
    return 0;
  });

  return (
    <>
      <div
        style={{
          height: "100%",
          overflow: "auto",
          padding: "0 16px",
          backgroundColor: "#fff",
          border: "1px solid rgba(140, 140, 140, 0.35)",
        }}
      >
        {trainingCourses?.isLoading ? (
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
          <List
            header={
              <div>
                <strong>
                  Active Courses: {trainingCourses?.trainingCourse?.length}
                </strong>
                {" | "}
                <strong>Total Students: {totalStudents}</strong>
                {" | "}
                <strong>Sort:</strong>
                <span
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  onClick={() => handleSort("asc")}
                >
                  Asc <ArrowUpOutlined />
                </span>
                <span
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  onClick={() => handleSort("desc")}
                >
                  Desc <ArrowDownOutlined />
                </span>
              </div>
            }
            dataSource={sortedData}
            renderItem={(item) => (
              <List.Item
                key={item?.id}
                style={{
                  backgroundColor: clickedItem === item.id ? "#f5f5f5" : "",
                }}
              >
                <List.Item.Meta
                  title={
                    <Row style={{ marginLeft: "5px" }} gutter={3}>
                      <Col>
                        <Badge
                          count={item?.id}
                          overflowCount={999999}
                          color="#faad14"
                        />
                      </Col>
                      <Col>
                        <strong
                          className="hoverable-strong"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            navigate.push(
                              `/mark-attendance?course-nick=${item?.nick}`
                            );
                          }}
                        >
                          {item?.nick}
                        </strong>
                      </Col>
                      <Col>
                        <ExclamationCircleOutlined
                          onClick={() =>
                            navigate.push(
                              `/mark-attendance?course-nick=${item?.nick}`
                            )
                          }
                        />
                      </Col>
                    </Row>
                  }
                  description={
                    <>
                      <Row
                        style={{ marginLeft: "5px", marginTop: "-5px" }}
                        gutter={25}
                      >
                        <Col>Starts: {formatDate(item?.startDate)}</Col>
                        <Col>{`Duration: ${item?.duration} months`}</Col>
                        <Col>{`Lectures Covered: ${
                          item?.courseAttendances?.data
                            ? item.courseAttendances.data?.length
                            : 0
                        }`}</Col>
                        <Col>{`Total Students: ${item?.students?.data?.length}`}</Col>
                      </Row>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </>
  );
};
export default ActiveCourses;
