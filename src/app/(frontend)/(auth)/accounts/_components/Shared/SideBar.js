"use client"
import React from "react";
// import { Link, useLocation } from "react-router-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import {
  PieChartOutlined,
  FieldTimeOutlined,
  DollarOutlined,
  MessageOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
  ReconciliationOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
  PlusOutlined
} from "@ant-design/icons";

const items = [
  {//DashBoard
    key: "/accounts",
    label: <Link href="/accounts">DashBoard</Link>,
    icon: <PieChartOutlined />,
  },
  {
    key: "/accounts/new-admission",
    label: <Link href="/accounts/new-admission">New Admission</Link>,
    icon: <PlusOutlined />,
  },
  {//Fee
    key: "fee",
    label: "Fee",
    icon: <DollarOutlined />,
    children: [
      {
        key: "/accounts/fee-course",
        label: <Link href="/accounts/fee-course">Batch</Link>,
      },
      {
        key: "/accounts/fee-status",
        label: <Link href="/accounts/fee-status">Status</Link>,
      },
      // {
      //   key: "13",
      //   label: <Link to="/fee-received">Received</Link>,
      // },
      // {
      //   key: "15",
      //   label: <Link to="/fee-dead">Dead</Link>,
      // },
      {
        key: "/accounts/fee-detail",
        label: <Link href="/accounts/fee-detail">Search</Link>,
      },
    ],
  },
  {//Student
    key: "19",
    label: "Student",
    icon: <UserOutlined />,
    children: [
      {
        key: "/accounts/view-student-detail",
        label: <Link href="/accounts/view-student-detail">View Detail</Link>,
      },
      {
        key: "/accounts/add-course",
        label: <Link href="/accounts/add-course">Add Course</Link>,
      },
    ]
  },
  {//Schedule
    key: "/accounts/training-schedule",
    label: <Link href="/accounts/training-schedule">Schedule</Link>,
    icon: <FieldTimeOutlined />,
  },
  {//Attendance
    key: "attendence",
    label: "Attendance",
    icon: <ReconciliationOutlined />,
    children: [
      {
        key: "/accounts/teacher-dashboard",
        label: <Link href="/accounts/teacher-dashboard">Attendance</Link>,
      },
      {
        key: "/accounts/mark-attendance",
        label: <Link href="/accounts/mark-attendance">Mark Attendance</Link>,
      },
      {
        key: "/accounts/view-attendance",
        label: <Link href="/accounts/view-attendance">View Attendance</Link>,
      },
    ],
  },
  {//Message
    key: "/accounts/message",
    label: <Link href="/accounts/message">Message</Link>,
    icon: <MessageOutlined />,
  },
  {//Expense
    key: "/accounts/expense",
    label: <Link href="/accounts/expense">Expense</Link>,
    icon: <DollarOutlined />,
  },
  {//Certificate
    key: "/accounts/student-certificate",
    label: <Link href="/accounts/student-certificate">Certificate</Link>,
    icon: <SafetyCertificateOutlined />,
  },
  {//Setting
    key: "/accounts/setting",
    label: <Link href="/accounts/setting">Setting</Link>,
    icon: <SettingOutlined />,
  },
  {//Team
    key: "5",
    label: "Team",
    icon: <UsergroupAddOutlined />,
    children: [
      {
        key: "/accounts/amara",
        label: <Link href="/accounts/amara">Amara</Link>,
      }
    ]
  },
];

const SideBar = () => {
  // let location = useLocation();
  let location = usePathname();
  // console.log("location: ", location);
  return (
    <>
      <Menu
        defaultSelectedKeys={[location]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        items={items}
        style={{ height: "100vh" }}
      />
    </>
  );
};

export default SideBar;
