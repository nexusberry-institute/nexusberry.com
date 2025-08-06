"use client"
import React, { useState, useEffect } from "react";
import { Table, Spin } from "antd";
import FilterCertificate from "./_components/FilterCertificate";
import getCertificatesApi from "@accounts/_hooks/Certificate/useGetCertificatesApi";

const StudentCertificate = () => {
  const [data, setData] = useState(null);
  const [searchType, setSearchType] = useState("studentId");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [status, setStatus] = useState("0");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleSelectedCourse = (value) => {
    if (value === undefined) {
      value = "all";
    }
    setSelectedCourse(value);
  };

  const handleStatus = (value) => {
    if (value === undefined) {
      value = "0";
    }
    setStatus(value);
  };

  const handleSearch = (value) => {
    setSearchValue(value);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const responseData = await getCertificatesApi();
      setData(responseData);
      setIsLoading(false);
    })();
  }, []);

  const filteredData = data?.filter((student) => {
    if (selectedCourse !== "all" && student.courseName !== selectedCourse) {
      return false;
    }
    if (status !== "0" && student.status !== status) {
      return false;
    }
    if (searchValue) {
      const searchValueStr = String(searchValue).toLowerCase();
      const studentValue = String(student[searchType]).toLowerCase();

      return studentValue.includes(searchValueStr);
    }

    return true;
  });

  const courseData = filteredData?.map((student) => ({
    key: student.id,
    id: student.id,
    studentId: student.studentId,
    studentName: student.name,
    courseName: student.courseName,
    mobile: student.mobile,
    status: student.status,
  }));

  const columns = [
    {
      title: "Attd. ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Course Name",
      dataIndex: "courseName",
      key: "courseName",
    },

    {
      title: "ID | Name | Mobile",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {`${record.studentId} `} <b>|</b> {`${record.studentName}`} <b>|</b>{" "}
          {`${record.mobile}`}
        </span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  return (
    <>
      <FilterCertificate
        selectedCourse={selectedCourse}
        searchType={searchType}
        setSearchType={setSearchType}
        handleSelectedCourse={handleSelectedCourse}
        handleStatus={handleStatus}
        status={status}
        handleSearch={handleSearch}
      />

      <div style={{ marginRight: "10px", marginLeft: "10px" }}>
        {isLoading ? (
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
        ) : courseData && courseData.length > 0 ? (
          <div>
            <Table columns={columns} dataSource={courseData} />
          </div>
        ) : (
          <h2 style={{ textAlign: "center", marginTop: "20px" }}>
            Data not found!
          </h2>
        )}
      </div>
    </>
  );
};

export default StudentCertificate;
