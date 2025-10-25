"use client"
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Drawer,
  Space,
  Col,
  TimePicker,
  Select,
  Form,
  message,
  Spin,
} from "antd";
import moment from "moment";
//
import { days, mediumTypes, rooms, duration } from "@accounts/_models/common";
//
import useGetTrainingCoursesApi from "@accounts/_hooks/Course/useGetTrainingCoursesApi";
import useGetTrainingScheduleApi from "@accounts/_hooks/Schedule/useGetTrainingScheduleApi";
import useUpdateTrainingScheduleApi from "@accounts/_hooks/Schedule/useUpdateTrainingScheduleApi";

const UpdateTrainingSchedule = ({ isVisible, onClose, recordId }) => {
  const updateTrainingSchedule = useUpdateTrainingScheduleApi();
  const { isLoading, data } = useGetTrainingScheduleApi();
  const { trainingCourse } = useGetTrainingCoursesApi();
  const initialValuesRef = useRef(null);

  const timeFormat = "HH:mm:ss";

  const getTeacherNameForSchedule = (schedule) => {
    const courseForSchedule = trainingCourse?.find(
      (course) => course.id === schedule.attributes.trainingCourse?.data?.id
    );
    return courseForSchedule?.teacher?.data?.attributes?.name || null;
  };

  const trainingScheduleData = data?.map((selectedid) => {
    const scheduleData = selectedid?.attributes?.trainingCourse?.data;
    return {
      id: selectedid.id,
      ...selectedid.attributes,
      nick: scheduleData?.attributes.nick || "",
      teacherName: getTeacherNameForSchedule(selectedid),
    };
  });

  const [form] = Form.useForm();

  useEffect(() => {
    const itemToEdit = trainingScheduleData?.find(
      (item) => item.id === recordId
    );
    if (itemToEdit) {
      const initialValues = {
        batchName: itemToEdit.nick,
        day: itemToEdit.day,
        batchTime: [
          moment(itemToEdit.startTime, timeFormat),
          moment(itemToEdit.endTime, timeFormat),
        ],
        room: itemToEdit.room,
      };
      form.setFieldsValue(initialValues);
      initialValuesRef.current = initialValues;
    }
  }, [recordId, trainingScheduleData]);

  const getCourseIdByName = (name) => {
    const course = trainingCourse?.find((course) => course.nick === name);
    return course ? course.id : null;
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (JSON.stringify(values) === JSON.stringify(initialValuesRef.current)) {
        onClose();
        return;
      }

      const trainingCourseId = getCourseIdByName(values.batchName);

      let data = {
        ...values,
        startTime: values.batchTime[0].format("HH:mm:ss"),
        endTime: values.batchTime[1].format("HH:mm:ss"),
        trainingCourse: trainingCourseId,
      };
      const TrainingScheduleData = {
        id: recordId,
        data,
      };

      await updateTrainingSchedule.mutateAsync(TrainingScheduleData);
      message.success("Training Schedule Edited Successfully!");
      onClose();
    } catch (error) {
      console.log("Validation failed:", error);
      message.error("Failed to Edit Training Schedule");
    }
  };

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

  const currentSchedule = trainingScheduleData?.find(
    (item) => item.id === recordId
  );
  const teacherName = currentSchedule?.teacherName || "";

  return (
    <>
      {updateTrainingSchedule.isLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <Drawer
          title={
            <>
              Edit Schedule Id: {recordId} <br />
              {teacherName ? (
                <span style={{ fontSize: "14px", color: "#1677ff" }}>
                  Teacher Name: {teacherName}
                </span>
              ) : (
                "  -  "
              )}
            </>
          }
          placement="right"
          closable={true}
          open={isVisible}
          onClose={onClose}
          extra={
            <Space>
              <Button type="primary" danger onClick={handleFormSubmit}>
                Done
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
                <strong>Selected Batch Name</strong>
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
                    disabled={true}
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
                  rules={[{ required: true, message: "Please select a room" }]}
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select room"
                    //   value={item.room}
                    options={getrooms()}
                  />
                </Form.Item>
              </Col>
            </Form>
          </div>
        </Drawer>
      )}
    </>
  );
};

export default UpdateTrainingSchedule;
