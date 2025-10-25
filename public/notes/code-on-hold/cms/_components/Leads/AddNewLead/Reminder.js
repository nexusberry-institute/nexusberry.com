import React from "react";
import { DatePicker, Select, Form } from "antd";
import TextArea from "antd/es/input/TextArea";

const Reminder = () => {
  return (
    <div style={{ marginTop: "10px" }}>
      <Form.Item
        label="Date"
        name={["reminder", "date"]}
      >
        <DatePicker size="small" style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Status"
        name={["reminder", "status"]}
      >
        <Select
          size="small"
          style={{
            width: "100%",
          }}
          options={[
            {
              value: "true",
              label: "True",
            },
            {
              value: "false",
              label: "False",
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="Reminder Note"
        name={["reminder", "followUpNote"]}
      >
        <TextArea
          size="small"
          placeholder="Reminder Note"
          autoSize={{
            minRows: 1,
            maxRows: 2,
          }}
        />
      </Form.Item>
    </div>
  );
};

export default Reminder;
