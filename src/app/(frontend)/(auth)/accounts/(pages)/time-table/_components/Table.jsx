"use client";

import { Spin, Table, Button, Drawer, Space, Modal, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import CreateTimeTable from "./createTimeTable";

export default function TableComponent({ data }) {
  
  const columns = [
    {
      title: "Table Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Batch",
      dataIndex: "batch",
      key: "id",
      render: (_, { batch }) => <span>{batch.slug}</span>,
    },
    {
      title: "day",
      dataIndex: "day",
      key: "day",
    },
    {
      title: "Room",
      dataIndex: "room",
      key: "room",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (_, { endTime }) => <span>{endTime}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <button
            style={{
              color: "#1677ff",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            // onClick={() => {
            //   getEditTrainingSchedule(record.id);
            // }}
          >
            <EditOutlined />
          </button>

          <button
            style={{
              color: "red",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            // onClick={() => showDeleteConfirm(record.id)}
          >
            <DeleteOutlined />
          </button>
        </Space>
      ),
    },
  ]
  return (
    <>
    <CreateTimeTable />
    <Table columns={columns} dataSource={data} />
    </>
  )
}