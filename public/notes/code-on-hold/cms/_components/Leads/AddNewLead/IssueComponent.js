import { Form, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";

const IssueComponent = () => {
  return (
    <>
      <Form.Item
        label="Issue"
        name={["issue", "type"]}
        rules={[
          {
            required: false,
            message: "Please select Issue",
          },
        ]}
        hasFeedback
      >
        <Select
          size="small"
          dropdownStyle={{ width: "25%" }}
          popupMatchSelectWidth={false}
          
          style={{
            width: "100%",
          }}
          options={[
            {
              value: "FINANCIAL",
              label: "Financial Issue",
            },
            {
              value: "DAYS_TIMIMG",
              label: "Days Timings",
            },
            {
              value: "COURSE_DURATION",
              label: "Course Duration",
            },
            {
              value: "COURSE_CONTENTS",
              label: "Course Content",
            },
            {
              value: "FACULTY",
              label: "Faculty",
            },
          ]}
          
        />
      </Form.Item>
      <Form.Item label="Issue Note" name={["issue", "issueNote"]}>
        <TextArea
          size="small"
          placeholder="Issue Note"
          autoSize={{
            minRows: 1,
            maxRows: 2,
          }}
        />
      </Form.Item>
    </>
  );
};

export default IssueComponent;
