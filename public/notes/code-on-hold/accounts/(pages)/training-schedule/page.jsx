"use client";
import React, { useEffect, useState } from "react";
import { Spin, Table, Button, Drawer, Space, Modal, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
//
import FilterSchedule from "./_components/FilterSchedule";
import CreateNewTrainingSchedule from "./_components/CreateNewTrainingSchedule";
import UpdateTrainingSchedule from "./_components/UpdateTrainingSchedule";
//api
import useGetTrainingScheduleApi from "@accounts/_hooks/Schedule/useGetTrainingScheduleApi";
import { useDeleteTrainingScheduleApi } from "@accounts/_hooks/Schedule/useDeleteTrainingScheduleApi";
import useGetTrainingCoursesApi from "@accounts/_hooks/Course/useGetTrainingCoursesApi";

const TrainingSchedule = () => {
  const { isLoading, data } = useGetTrainingScheduleApi();
  const [selectedDay, setSelectedDay] = useState("all");
  const [selectedRoom, setSelectedRoom] = useState("0");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedTeacher, setselectedTeacher] = useState("all");
  const [openDrawer, setOpenDrawer] = useState(false);
  const fetchedData = useGetTrainingScheduleApi();
  const { trainingCourse } = useGetTrainingCoursesApi();
  const [deletedData, setDeletedData] = useState(fetchedData.data);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState(null);

  const { confirm } = Modal;

  const handleSelectDay = (day) => {
    setSelectedDay(day === "all" ? null : day);
  };

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  const handleFiltersChange = ({ name, value }) => {
    if (name === "course") {
      setSelectedCourse(value);
    }
  };

  const handleTeacherFilter = ({ name, value }) => {
    if (name === "teacher") {
      setselectedTeacher(value);
    }
  };

  const showDrawer = () => {
    setOpenDrawer(true);
  };

  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    setDeletedData(data);
  }, [data]);

  const getTeacherNameForSchedule = (schedule) => {
    const courseForSchedule = trainingCourse?.find(
      (course) => course.id === schedule.attributes.trainingCourse?.data?.id
    );
    return courseForSchedule?.teacher?.data?.attributes?.name || null;
  };

  const transformedData = deletedData?.map((item, index) => {
    const { id, attributes } = item;

    const courses = attributes.trainingCourse?.data;
    const courseData = courses ? { ...courses.attributes } : {};

    const timeStart = moment(attributes.startTime, "hh:mm a").format("hh:mm a");
    const timeEnd = moment(attributes.endTime, "hh:mm a").format("hh:mm a");

    return {
      key: index,
      id: id,
      name: courseData.nick,
      day: attributes.day,
      time: `${timeStart} To ${timeEnd}`,
      room: attributes.room,
      duration: courseData.duration ? `${courseData.duration} Months` : "-",
      startDate: courseData.startDate ? `${courseData.startDate}` : "-",
      teacher: getTeacherNameForSchedule(item),
    };
  });

  const columns = [
    {
      title: "Attd. ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Course Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Course Start | Duration",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>{`${record.startDate} | ${record.duration}`}</span>
      ),
    },

    {
      title: "Day | Slot | Room",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {`${record.day} `} <b>|</b> {`${record.time}`} <b>|</b>{" "}
          {`${record.room}`}
        </span>
      ),
    },

    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <button
            style={{
              color: "#1677ff",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => {
              getEditTrainingSchedule(record.id);
            }}
          >
            <EditOutlined />
          </button>

          <button
            style={{
              color: "red",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => showDeleteConfirm(record.id)}
          >
            <DeleteOutlined />
          </button>
        </Space>
      ),
    },
  ];

  const filteredData = transformedData?.filter((item) => {
    return (
      (!selectedDay || selectedDay === "all" || item.day === selectedDay) &&
      (selectedRoom === "0" || item.room === selectedRoom) &&
      (!selectedCourse ||
        selectedCourse === "all" ||
        item.name === selectedCourse) &&
      (!selectedTeacher ||
        selectedTeacher === "all" ||
        item.teacher === selectedTeacher)
    );
  });

  const courseSet = new Set(transformedData?.map((item) => item.name));
  const courses = [...courseSet];

  const teacherSet = new Set(transformedData?.map((item) => item.teacher));
  const teachers = [...teacherSet];

  const mutation = useDeleteTrainingScheduleApi();

  const showDeleteConfirm = (recordId) => {
    confirm({
      title: "DELETE",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this Training Schedule?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        mutation.mutate(recordId, {
          onSuccess: () => {
            const updatedData = deletedData.filter(
              (item) => item.id !== recordId
            );
            setDeletedData(updatedData);
            message.success("Training Schedule Deleted Successfully!");
          },
          onError: (error) => {
            message.error(
              "Failed to Delete Training Schedule. Please Try Again."
            );
          },
        });
      },
      onCancel() {
        // message.warning("Cancel to Delete Training Schedule");
      },
    });
  };

  const getEditTrainingSchedule = (recordId) => {
    setEditingRecordId(recordId);
    setVisibleDrawer(true);
  };

  const closeEditDrawer = () => {
    setVisibleDrawer(false);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginRight: "10px",
          marginLeft: "10px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "25px", flex: 1 }}>
          Training Schedule
        </h1>

        {mutation.isLoading && (
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
        )}
        <CreateNewTrainingSchedule
          visible={openDrawer}
          onClose={onCloseDrawer}
        />
      </div>

      <UpdateTrainingSchedule
        isVisible={visibleDrawer}
        onClose={closeEditDrawer}
        recordId={editingRecordId}
      />

      <FilterSchedule
        onSelectDay={handleSelectDay}
        onSelectRoom={handleSelectRoom}
        handleFiltersChange={handleFiltersChange}
        handleTeacherFilter={handleTeacherFilter}
        selectedCourse={selectedCourse}
        selectedTeacher={selectedTeacher}
        selectedRoom={selectedRoom}
      />
      <div style={{ marginRight: "10px", marginLeft: "10px" }}>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
            }}
          >
            <Spin />
          </div>
        ) : transformedData && transformedData.length > 0 ? (
          <>
            {courses.map((course, index) => {
              const courseData = filteredData.filter(
                (item) => item.name === course
              );
              return courseData.length ? (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <h3>{course}</h3>
                  <Table
                    columns={columns}
                    dataSource={courseData}
                    pagination={false}
                  />
                </div>
              ) : null;
            })}

            {!courses.some((course) =>
              filteredData.some((item) => item.name === course)
            ) ? (
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <h2>No Schedule found!</h2>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
};

export default TrainingSchedule;
