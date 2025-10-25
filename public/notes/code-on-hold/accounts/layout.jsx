"use client"
import React, { useState } from "react";
import { Layout } from "antd";
import SideBar from "@accounts/_components/Shared/SideBar";
import "./accounts.css";
import { QueryClient, QueryClientProvider } from "react-query";
// import reportWebVitals from "./reportWebVitals";


export default function AccountLayout({ children }) {
  const { Sider, Content } = Layout;
  const queryClient = new QueryClient();

  const [collapsed, setCollapsed] = useState(false);
  const [menuButton, setMenuButton] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Sider
          width="160px"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth="60px"
          menubutton={menuButton.toString()}
        >
          <SideBar />
        </Sider>

        <Content>
          {children}
        </Content>
      </Layout>
    </QueryClientProvider>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();