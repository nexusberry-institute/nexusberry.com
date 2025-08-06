"use client"
import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import { usePathname } from "next/navigation";
import { Table, Radio } from "antd";

const MarkAttendanceDetail = ({
  studentAttendance,
  setStudentAttendance,
  initialStudentAttendance,
  filteredStudents,
}) => {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedValues, setSelectedValues] = useState({});

  // const location = useLocation();
  const location = usePathname();
  const params = new URLSearchParams(location.search);
  const nick = params.get("course-nick");

  const handleRadioChange = (e, studentId) => {
    const { value } = e.target;
    setSelectedValues((prevSelectedValues) => ({
      ...prevSelectedValues,
      [studentId]: value,
    }));

    setStudentAttendance({
      ...studentAttendance,
      [studentId]: e.target.value,
    });
  };

  const columns = [
    {
      title: "ID | Name | Email",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {`${record.id} | `} <b>{record.name}</b> {`| ${record.email}`}
        </span>
      ),
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, student) => (
        <Radio.Group
          required
          onChange={(e) => handleRadioChange(e, student.id)}
          value={studentAttendance[student.id]}
        >
          <Radio value="Present">Present</Radio>
          <Radio value="Absent">Absent</Radio>
        </Radio.Group>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => { },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
    type: "checkbox",
    renderCell: (checked, record, index, originNode) => (
      <div>
        {index + 1}. {originNode}
      </div>
    ),
  };

  const data =
    filteredStudents?.[0]?.map((student) => ({
      key: student.id,
      id: student.id,
      email: student?.attributes?.email,
      name: student?.attributes?.name,
      attendance: "Present",
    })) || [];

  data.forEach((student) => {
    initialStudentAttendance[student.id] = "Present";
  });

  useEffect(() => {
    setSelectedValues(
      data.reduce((acc, student) => {
        acc[student.id] = "Present";
        return acc;
      }, {})
    );
  }, [data]);

  return (
    <>
      <Radio.Group
        onChange={({ target: { value } }) => {
          setSelectionType(value);
        }}
        value={selectionType}
      ></Radio.Group>

      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </>
  );
};

export default MarkAttendanceDetail;
