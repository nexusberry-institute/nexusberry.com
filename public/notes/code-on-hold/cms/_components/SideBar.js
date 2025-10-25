'use client'
import React from "react";
import { Menu } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
    key: "/cms",
    label: <Link href="/cms">DashBoard</Link>,
    icon: <PieChartOutlined />,
  },
  {
    key: "/cms/leads",
    label: <Link href="/cms/leads">Leads</Link>,
    icon: <DesktopOutlined />,
  },
  {
    key: "/cms/message",
    label: <Link href="/cms/message">Message</Link>,
    icon: <ContainerOutlined />,
  },
  {
    key: "/cms/pipeline",
    label: <Link href="/cms/pipeline">Pipeline</Link>,
    icon: <TeamOutlined />,
  },
  {
    key: "/cms/team",
    label: <Link href="/cms/team">Team</Link>,
    icon: <TeamOutlined />,
  },
  {
    key: "/cms/admission",
    label: <Link href="/cms/admission">Admission</Link>,
    icon: <AppstoreOutlined />,
  },
  {
    key: "/cms/courses-info",
    label: <Link href="/cms/courses-info">CoursesInfo</Link>,
    icon: <QuestionOutlined />,
  },
  {
    key: "/cms/help",
    label: <Link href="/cms/help">Help</Link>,
    icon: <QuestionOutlined />,
  },
];

const SideBar = () => {
  // let location = useLocation();
  let location = usePathname();

  
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
