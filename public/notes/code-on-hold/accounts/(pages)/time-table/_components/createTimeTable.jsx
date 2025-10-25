"use client"
import React, { useState } from "react";
import {
  Button,
  Drawer,
  Space,
  Col,
  TimePicker,
  Select,
  DatePicker,
  Form,
  message,
  Spin,
} from "antd";

const CreateTimeTable = () => {
  const [open, setOpen] = useState(false);
  const dateFormat = "YYYY-MM-DD";
  const timeFormat = "HH:mm:ss";

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [form] = Form.useForm();

  return (
    <>
      <Space>
        <Button type="primary" onClick={showDrawer}>
          + Create new schedule
        </Button>
      </Space>
      <Drawer
        title={`New Schedule`}
        placement="right"
        onClose={() => onClose()} //form.resetFields()
        open={open}
        extra={
          <Space>
            {/* <Button onClick={handleCancel}>Clear</Button> */}
            <Button type="primary"
            //  onClick={handleFormSubmit}
             >
              Add
            </Button>
          </Space>
        }
      >
        <div
          style={{
            backgroundColor: "white",
            margin: "0 10px 10px 10px",
          }}
        >
          <Form form={form}>
            <Col span={12}>
              <strong>Select Batch Name</strong>
            </Col>
            <Col span={24} style={{ marginBottom: "20px" }}>
              <Form.Item
                name="batchName"
                rules={[
                  { required: true, message: "Please select batch name" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select batch name"
                  // options={getTrainingCourse()}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <strong>Select Day</strong>
            </Col>
            <Col span={24} style={{ marginBottom: "20px" }}>
              <Form.Item
                name="day"
                rules={[{ required: true, message: "Please select a day" }]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select day"
                  // options={getWeekdays()}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <strong>Select Batch Time</strong>
            </Col>
            <Col span={24} style={{ marginBottom: "20px" }}>
              <Form.Item
                name="batchTime"
                rules={[
                  { required: true, message: "Please select batch time" },
                ]}
              >
                <TimePicker.RangePicker
                  format={timeFormat}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <strong>Select Room</strong>
            </Col>
            <Col span={24} style={{ marginBottom: "20px" }}>
              <Form.Item
                name="room"
                rules={[
                  { required: true, message: "Please select a room" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select room"
                  // options={getrooms()}
                />
              </Form.Item>
            </Col>
          </Form>
        </div>
      </Drawer>
    </>
  );
};
export default CreateTimeTable;
