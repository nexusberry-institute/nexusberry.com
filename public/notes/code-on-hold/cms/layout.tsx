"use client"
import "./cms.css"
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Layout } from "antd";
import SideBar from "./_components/SideBar";

export default function MainLayout({ children }: React.PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false);
  const queryClient = new QueryClient();
  const { Sider, Content } = Layout;


  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Sider
          width="160px"
          collapsible
          collapsed={collapsed}
          onCollapse={(value: boolean) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth="60px"
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
