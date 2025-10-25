"use client"
import React from "react";
import { Col, Row, Select } from "antd";
import { DatePicker, Space } from "antd";
// import { useLocation } from "react-router-dom";
import { usePathname } from "next/navigation";

const { Option } = Select;

const onChange = (value, dateString) => {};
const onOk = (value) => {};

const MarkAttendanceNav = ({ setFormData, formData }) => {
  // const location = useLocation();
  const location = usePathname();
  const params = new URLSearchParams(location.search);
  const nick = params.get("course-nick");

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          margin: "0 10px -10px 10px",
        }}
      >
        <Row
          align={"middle"}
          style={{
            marginLeft: "15px",
            paddingTop: "15px",
            paddingBottom: "15px",
            marginTop: "15px",
          }}
        >
          <Col span={3}>
            <strong>Selected Batch:</strong>
          </Col>
          <Col span={6}>
            <Select
              defaultValue={nick}
              style={{ width: "100%", marginLeft: "-30px" }}
              onChange={(value) =>
                setFormData({ ...formData, trainingCourse: value })
              }
            >
              <Option value={nick} disabled>
                {nick}
              </Option>
            </Select>
          </Col>

          <Col span={1}>
            <strong>Date:</strong>
          </Col>
          <Col span={4}>
            <Space direction="vertical" size={12}>
              <DatePicker
                showTime
                onChange={(value) => {
                  setFormData({ ...formData, date: value });
                  onChange(value);
                }}
                onOk={onOk}
              />
            </Space>
          </Col>

          <Col span={1}>
            <strong style={{ marginLeft: "30px" }}>Type:</strong>
          </Col>
          <Col span={3}>
            <Select
              defaultValue="all"
              style={{ width: "100%", marginLeft: "28px" }}
              onChange={(value) => setFormData({ ...formData, type: value })}
            >
              <Option value="all" disabled>
                Choose here
              </Option>
              <Option value="Class">Class</Option>
              <Option value="Lab">Lab</Option>
              <Option value="Makeup-Class">Makeup-Class</Option>
              <Option value="Makeup-Lab">Makeup-Lab</Option>
            </Select>
          </Col>

          <Col span={1}>
            <strong style={{ marginLeft: "55px" }}>Medium:</strong>
          </Col>
          <Col span={3}>
            <Select
              defaultValue="all"
              style={{ width: "100%", marginLeft: "80px" }}
              onChange={(value) => setFormData({ ...formData, medium: value })}
            >
              <Option value="all" disabled>
                Choose here
              </Option>
              <Option value="Online">Online</Option>
              <Option value="Physical">Physical</Option>
            </Select>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default MarkAttendanceNav;
