import React from "react";
import { Button, Col, DatePicker, Input, Row, Select, Space, Form } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const AdmissionForm = ({ postNewAdmission, trainingCourses }) => {

  return (
    <>
      <p
        style={{
          fontSize: "30px",
          fontFamily: "Roboto",
          marginBottom: "15px",
        }}
      >
        <b>New Addmission</b>
      </p>
      <Row>
        <Col span={8}>
          <Form.Item
            style={{ marginBottom: "50px", marginRight: "20px" }}
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            style={{ marginRight: "20px" }}
            label="Mobile"
            name="mobile"
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Email"
            name="email"
            rules= {
              [{
                type: "email",
                message: "The input is not valid E-mail!"
              }]
            }
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      
      <p
        style={{
          fontSize: "30px",
          fontFamily: "Roboto",
          marginBottom: "15px",
        }}
      >
        <b>Training Course</b>
      </p>
      <Form.Item
        style={{ marginBottom: "80px" }}
        label="Training Courses Batch"
        name="trainingCourse"
        rules={[
          {
            required: true,
            message: "Please select Course!",
          },
        ]}
      >
        <Select placeholder="select your course">
          {trainingCourses?.map((course) => (
            <Option key={course.id} value={course.id}>
              {course.nick}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <p
        style={{
          fontSize: "30px",
          fontFamily: "Roboto",
          marginBottom: "15px",
        }}
      >
        <b>Installment Plan</b>
      </p>
      <Form.List name="installments">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space
                key={key}
                style={{
                  display: "flex",
                  marginBottom: 8,
                }}
                align="baseline"
              >
                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ display: "block" }}>Amount</span>
                  </div>
                  <Form.Item
                    {...restField}
                    name={[name, "amount"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing amount",
                      },
                    ]}
                  >
                    <Input placeholder="Amount" type="number" />
                  </Form.Item>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ display: "block" }}>Due Date</span>
                  </div>
                  <Form.Item
                    {...restField}
                    name={[name, "dueDate"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing due date",
                      },
                    ]}
                  >
                    <DatePicker format="YYYY-MM-DD" placeholder="Due Date" />
                  </Form.Item>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ display: "block" }}>Status</span>
                  </div>
                  <Form.Item
                    {...restField}
                    name={[name, "status"]}
                    rules={[
                      {
                        required: true,
                        message: "Missing status",
                      },
                    ]}
                  >
                    <Select placeholder="Status" value="Received">
                      <Option value="Received">Received</Option>
                      <Option value="Pending">Pending</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ display: "block" }}>Pay Date</span>
                  </div>
                  <Form.Item {...restField} name={[name, "paymentDate"]}>
                    <DatePicker format="YYYY-MM-DD" placeholder="Pay Date" />
                  </Form.Item>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ display: "block" }}>Pay Method</span>
                  </div>
                  <Form.Item {...restField} name={[name, "paymentMethod"]}>
                    <Select placeholder="Pay Method">
                      <Option value="Bank">Bank</Option>
                      <Option value="Cash">Cash</Option>
                      <Option value="JazzCash">JazzCash</Option>
                      <Option value="EasyPaissa">EasyPaisa</Option>
                    </Select>
                  </Form.Item>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ display: "block" }}>Notes</span>
                  </div>
                  <Form.Item {...restField} name={[name, "note"]}>
                    <Input placeholder="Notes" />
                  </Form.Item>
                </div>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add Installment
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      
      <Form.Item>
        <Row justify={"center"}>
          <Button
            onClick={postNewAdmission}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Row>
      </Form.Item>
    </>
  );
};

export default AdmissionForm; // Export as default
