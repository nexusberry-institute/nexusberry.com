"use client";
import React, { useState } from "react";
import {
  Badge,
  Modal,
  Input,
  Form,
  Button,
  DatePicker,
  message,
  Select,
} from "antd";
//
import dayjs from 'dayjs';
import { format } from "date-fns";
//
import usePutInstallmentApi from "@accounts/_hooks/Fee/usePutInstallmentApi";

const InstallmentIdBadgeModal = ({ student, fee, course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mutation = usePutInstallmentApi();

  const {id, amount, status, note} = fee;
  const {name} = student;
  const  courseNick = student.trainingCourses?.find(c => c.id === course)?.nick ?? "";

  const onFinish = (values) => {
    // values.paymentDate is dayjs object
    values.paymentDate = values.paymentDate.format('YYYY-MM-DD HH:mm:ss');
    console.log(values);

    mutation.mutate(
      { id, data: values },
      {
        onSuccess: (data) => {
          message.success("Installment Updated sucessfully!");
          setIsModalOpen(false);
        },
        onError: (error) => {
          const msg = error.response?.data?.error?.message || error.message;
          message.error(msg);
          console.log(error);
        },
      }
    );
  };

  return (
    <>
      <Badge
        count={id}
        overflowCount={999999}
        color={
          status === "Received"
            ? "green"
            : status === "Pending"
            ? "orange"
            : "red"
        }
        // onClick={() =>
        //   navigate(`/fee-detail?id=${rowData.id}`)
        // }
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: "pointer" }}
      />
      {status === "Pending" && (
        <Modal
          title={`${name} | ${courseNick}`}
          open={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <p style={{textAlign: "center"}}><b>Amount: Rs. {amount}</b></p>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              status : "Received",
              paymentMethod: "Bank",
              paymentDate: dayjs(),
              note,
            }}
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Status */}
            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Please input your Status!",
                },
              ]}
            >
              <Select
                style={{
                  width: 120,
                }}
                options={[
                  {
                    value: "Received",
                    label: "Received",
                  },
                  {
                    value: "Dead",
                    label: "Dead",
                  },
                ]}
              />
            </Form.Item>
            
             {/* Payment Method */}
             <Form.Item
              label="Payment Method"
              name="paymentMethod"
              rules={[
                {
                  required: true,
                  message: "Payment method is required!",
                },
              ]}
            >
              <Select
                style={{
                  width: 120,
                }}
                options={[
                  {
                    value: "Bank",
                    label: "Bank",
                  },
                  {
                    value: "Cash",
                    label: "Cash",
                  },
                  {
                    value: "EasyPaissa",
                    label: "EasyPaissa",
                  },
                  {
                    value: "JazzCash",
                    label: "JazzCash",
                  },
                ]}
              />
            </Form.Item>

            {/* paymentDate */}
            <Form.Item
              label="Payment Date"
              name="paymentDate"
              rules={[
                {
                  required: true,
                  message: "Payment Date is required",
                },
              ]}
            >
              <DatePicker showTime />
            </Form.Item>

            {/* Note */}
            <Form.Item label="Note" name="note">
              <Input />
            </Form.Item>

            {/* Submit */}
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={mutation.isLoading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};
export default InstallmentIdBadgeModal;
