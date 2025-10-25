import React from "react";

import { Form, Select } from "antd";
import TextArea from "antd/es/input/TextArea";

import useGetStaffApi from "@cms/_hooks/leads/UseGetStaff";
const { Option } = Select;

const AssigndToComponent = () => {
  const { staffList } = useGetStaffApi();

  return (
    <div style={{ marginTop: "10px" }}>
      <Form.Item label="Assigned To" name={["assignLeedTo", "assignTo"]}>
        <Select
          size="small"
          placeholder="Assigned To"
          style={{ width: "100%" }}
          allowClear
        >
          <Option value="all">All</Option>
          {staffList?.map((staff) => (
            <Option key={staff.id} value={staff.id}>
              {staff.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Assigned By"
        name={["assignLeedTo", "assignedBy"]}
        // label="Reminder Status"
      >
        <Select
          size="small"
          placeholder="Assigned By"
          // value={assignedTo}
          style={{ width: "100%" }}
          allowClear
        >
          <Option value="all">All</Option>
          {staffList?.map((staff) => (
            <Option key={staff.id} value={staff.id}>
              {staff.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Assigned Note"
        name={["assignLeedTo", "assignNote"]}
        // label="Follow-up Note"
      >
        <TextArea
          size="small"
          placeholder="Assign Note"
          autoSize={{
            minRows: 1,
            maxRows: 2,
          }}
        />
      </Form.Item>
    </div>
  );
};

export default AssigndToComponent;
