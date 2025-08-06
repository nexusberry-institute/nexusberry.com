import { Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";

const CollapseComponsts = () => {
  return (
    <>
      <Form.Item label="Education" name="education" hasFeedback>
        <Input
          style={{ width: "100%" }}
          size="small"
          placeholder="Please Enter Education"
        />
      </Form.Item>
      <Form.Item label="City" name="city" hasFeedback>
        <Input
          style={{ width: "100%" }}
          size="small"
          placeholder="Please Enter City"
        />
      </Form.Item>

      <Form.Item label="Province" name="province" hasFeedback>
        <Input
          style={{ width: "100%" }}
          size="small"
          placeholder="Please Enter Province"
        />
      </Form.Item>

      <Form.Item label="Country" name="country" hasFeedback>
        <Input
          style={{ width: "100%" }}
          size="small"
          placeholder="Please Enter Country"
        />
      </Form.Item>
      <Form.Item
        label="IsGender"
        name="gender"
      >
        <Select
          size="small"
          style={{
            width: "100%",
          }}
          options={[
            {
              value: "true",
              label: "Male",
            },
            {
              value: "false",
              label: "Female",
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="IsReqHostel"
        name="isReqHostel"
      >
        <Select
          size="small"
          defaultValue="false"
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
        label="IsOnline"
        name="isOnline"
        // label="Reminder Status"
      >
        <Select
          size="small"
          defaultValue="false"
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
        label="Query"
        name="query"
        // label="Follow-up Note"
      >
        <TextArea
          size="small"
          placeholder="Query"
          autoSize={{
            minRows: 1,
            maxRows: 3,
          }}
        />
      </Form.Item>
      <Form.Item label="Source" name="source">
        <Select
          placeholder="source"
          size="small"
          style={{
            width: "100%",
          }}
          allowClear
          options={[
            {
              value: "Web-Inq",
              label: "Website",
            },
            {
              value: "facebook",
              label: "Facebook",
            },
            {
              value: "instgram",
              label: "Instagram",
            },
            {
              value: "physical visit",
              label: "Physical Visit",
            },
          ]}
        />
      </Form.Item>
    </>
  );
};

export default CollapseComponsts;
