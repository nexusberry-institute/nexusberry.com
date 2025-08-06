import React from "react";
import { Collapse, Table } from 'antd';

const MernStackCourses = () => {
  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];
  
  const columns = [
    {
      title: 'Course',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Fee',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Timings',
      dataIndex: 'address',
      key: 'address',
    }
  ];
  
  return (
    <>
    <p>Course Brocher PDF</p>
    <p>Student Portal Link </p>
    <p>Student Group Link </p>
    <p>Demo Recoding Link</p>

    <p>Sample Lecture Video Link</p>
    <Table dataSource={dataSource} columns={columns} size="small"/>
    </>
);
}

const FlutterCourse = () => (
    <p>table</p>
);

const DSMLCourses = () => (
  <p>table</p>
);

const items = [
  {
    key: '1',
    label: 'MERN Stack Courses',
    children: <MernStackCourses />,
  },
  {
    key: '2',
    label: `Flutter & Dart App Development Course`,
    children: <FlutterCourse />,
  },
  {
    key: 'DSML',
    label: `Data Science and Machine Learning Courses`,
    children: <DSMLCourses />,
  },
];

export default function CourseInfo() {
  return (
      <Collapse items={items} />
  );
}
