import React from "react";
// import { Link, useLocation } from "react-router-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  QuestionOutlined
} from "@ant-design/icons";

const items = [
  {
    key: "1",
    label: <Link href="/">DashBoard</Link>,
    icon: <PieChartOutlined />,
  },
  {
    key: "2",
    label: <Link href="/leads">Leads</Link>,
    icon: <DesktopOutlined />,
  },
  {
    key: "3",
    label: <Link href="/message">Message</Link>,
    icon: <ContainerOutlined />,
  },
  {
    key: "4",
    label: <Link href="/pipeline">Pipeline</Link>,
    icon: <TeamOutlined />,
  },
  {
    key: "5",
    label: <Link href="/team">Team</Link>,
    icon: <TeamOutlined />,
  },
  {
    key: "6",
    label: <Link href="/admission">Admission</Link>,
    icon: <AppstoreOutlined />,
  },
  {
    key: "8",
    label: <Link href="/courses-info">CoursesInfo</Link>,
    icon: <QuestionOutlined />,
  },
  {
    key: "7",
    label: <Link href="/help">Help</Link>,
    icon: <QuestionOutlined />,
  },
];

const SideBar = () => {
  // let location = useLocation();
  let location = usePathname();
  
  return (
    <>
      <Menu
        defaultSelectedKeys={[location.pathname]}
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
