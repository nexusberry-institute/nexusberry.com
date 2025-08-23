import React from "react";
import { Button, DatePicker, Input, Row, Select, Space, Form, message, Table } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
//
import usePostFeeInstallmentApi from "@accounts/_hooks/Fee/usePostFeeInstallmentApi";

const { Option } = Select;

const FeeInstallmentComponent = ({ student, selectedCourseId }) => {
  // console.log("student: ", student);
  const [form] = Form.useForm();
  const mutation = usePostFeeInstallmentApi();

  if (!student || !selectedCourseId) return <div />;

  const onFinish = (values) => {
    form
      .validateFields()
      .then((dataObj) => {
        mutation.mutate({ installments: dataObj.installments, studentId: student.id, selectedCourseId }, {
          onSuccess: (data) => {
            message.success("Data uploaded successfully!");
            // console.log(data);
            form.resetFields();
          },
          onError: (error) => {
            const msg = error.response?.data?.error?.message || error.message;
            message.error(msg);
            console.log("error: ", msg);
          },
        });
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate) => <span>{dueDate?.split("T")[0]}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Pay Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (payDate) => <span>{payDate?.split("T")[0]}</span>
    },
    {
      title: 'Pay Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Notes',
      dataIndex: 'note',
      key: 'note',
    },
  ];


  return (
    <>
      <Table pagination={false} dataSource={student?.feeInstallments} columns={columns} />
      <h3>Add more Installments:</h3>
      <Form autoComplete="off" form={form} onFinish={onFinish}>
        <Form.List name="installments">
          {(fields, { add, remove }) => (
            <>
              {fields?.map(({ key, name, ...restField }) => (
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
                      <Select placeholder="Status" style={{ width: "100px" }}>
                        <Option value="Pending">Pending</Option>
                        <Option value="Received">Received</Option>
                        <Option value="Dead">Dead</Option>
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
                        <Option value="Cash">Cash</Option>
                        <Option value="Bank">Bank</Option>
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
            <Button type="primary" htmlType="submit">
              Update installments of Selected Course
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};

export default FeeInstallmentComponent;
