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
import { days, mediumTypes, rooms, duration } from "@accounts/_models/common";
//
import useGetTrainingCoursesApi from "@accounts/_hooks/Course/useGetTrainingCoursesApi";
import usePostTrainingScheduleApi from "@accounts/_hooks/Schedule/usePostTrainingScheduleApi";

const CreateNewTrainingSchedule = () => {
  const postTrainingSchedule = usePostTrainingScheduleApi();
  const [open, setOpen] = useState(false);
  const { trainingCourse } = useGetTrainingCoursesApi();
  const dateFormat = "YYYY-MM-DD";
  const timeFormat = "HH:mm:ss";

  const getCourseIdByName = (name) => {
    const course = trainingCourse?.find((course) => {
      return course.nick === name;
    });

    return course ? course.id : null;
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [form] = Form.useForm();

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const trainingCourseId = getCourseIdByName(values.batchName);

        let data = {
          ...values,
          startTime: values.batchTime[0].format("HH:mm:ss"),
          endTime: values.batchTime[1].format("HH:mm:ss"),
          trainingCourse: trainingCourseId,
        };
        const TrainingScheduleData = {
          data,
        };

        postTrainingScheduleData(TrainingScheduleData);
      })
      .catch((errorInfo) => {
        console.log("Validation failed:", errorInfo);
      });
  };

  async function postTrainingScheduleData(data) {
    try {
      const response = await postTrainingSchedule.mutateAsync(data);

      message.success("Training Schedule Created Successfully!");
      setOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to Created Training Schedule");
    }
  }

  const getTrainingCourse = () => {
    const trainingBatchCourses = trainingCourse?.map((course) => {
      return {
        label: course.nick,
        value: course.nick,
      };
    });

    return trainingBatchCourses;
  };

  const getWeekdays = () => {
    const weekdays = days.map((day) => {
      return {
        label: day,
        value: day,
      };
    });
    return weekdays;
  };

  const getrooms = () => {
    const availableRooms = rooms.map((room) => {
      if (room === mediumTypes.ONLINE) {
        return {
          label: room,
          value: room,
        };
      } else {
        return {
          label: `Room ${room}`,
          value: String(room),
        };
      }
    });
    return availableRooms;
  };

  const handleCancel = () => {
    form.resetFields();
  };

  return (
    <>
      {postTrainingSchedule.isLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
          }}
        >
          <Spin size="large"></Spin>
        </div>
      ) : (
        <>
          <Space>
            <Button type="primary" onClick={showDrawer}>
              + Create new schedule
            </Button>
          </Space>
          <Drawer
            title={`New Schedule`}
            placement="right"
            onClose={() => onClose(form.resetFields())}
            open={open}
            extra={
              <Space>
                <Button onClick={handleCancel}>Clear</Button>
                <Button type="primary" onClick={handleFormSubmit}>
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
                      options={getTrainingCourse()}
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
                      options={getWeekdays()}
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
                      options={getrooms()}
                    />
                  </Form.Item>
                </Col>
              </Form>
            </div>
          </Drawer>
        </>
      )}
    </>
  );
};
export default CreateNewTrainingSchedule;
