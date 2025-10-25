import React from "react";
import {Spin, message, Form, Input, DatePicker, Space } from "antd";
import dayjs from "dayjs";
// lib
import { makeActivityJson } from "@cms/_lib/makeActivityJson";
//api
import usePutLeadApi from "@cms/_hooks/leads/usePutLeadApi";
import useShowStrapiError from "../uiHooks/useShowStrapiError";

const disabledDate = (current) => {
    return current && current < dayjs().endOf("day").subtract(1, "day");
};

// Reminder | Issue column
function ColumnReminderIssue(props) {
  const { id, reminderDate, reminderNote, leadIssue, activity } 
    = props.rowData;
  const [selectedReminderDate, setSelectedReminderDate] 
        = React.useState(reminderDate);
  const updateLeadMutation = usePutLeadApi();
  const { showErrModel } = useShowStrapiError();

  const handleleadIssueUpdate = ( newLeadIssue) => {
    updateLeadMutation.mutate(
      {
        id,
        data: {
           leadIssue: newLeadIssue,
          activity: makeActivityJson({
            activity,
            what: " Issue",
            content:  newLeadIssue,
          }),
        },
      },
      {
        onSuccess: (data) => {
          message.success("Issue Updated sucessfully!");
        },
        onError: (error) => {
          showErrModel(error);
        },
      }
    );
  };

  // function(date: dayjs, dateString: string)
  const handleReminderDateUpdate = (date, dateString) => {
    setSelectedReminderDate(dateString ? dayjs(dateString): "");
    updateLeadMutation.mutate(
      {
        id,
        data: {
           reminderDate: dateString,
          activity: makeActivityJson({
            activity,
            what: "ReminderDate",
            content:  dateString,
          }),
        },
      },
      {
        onSuccess: (data) => {
          message.success("ReminderDate Updated sucessfully!");
        },
        onError: (error) => {
          setSelectedReminderDate(dayjs(reminderDate)); // reset to props.reminderDate
          showErrModel(error);
        },
      }
    );
  };

  const handleReminderNoteUpdate = ( newReminderNote) => {
    updateLeadMutation.mutate(
      {
        id,
        data: {
           reminderNote: newReminderNote,
          activity: makeActivityJson({
            activity,
            what: "ReminderNote",
            content:  newReminderNote,
          }),
        },
      },
      {
        onSuccess: (data) => {
          message.success("ReminderNote Updated sucessfully!");
        },
        onError: (error) => {
          showErrModel(error);
        },
      }
    );
  };

  return (
    <Spin spinning={updateLeadMutation.isLoading}>
    <Space.Compact direction="vertical">

    <Form
        size="small"
        layout="inline"
        initialValues={{leadIssue: leadIssue}}
        onFinish={(values) => handleleadIssueUpdate(values.leadIssue)}
    >
        <Form.Item name="leadIssue">
        <Input placeholder="Issue" variant="borderless"/>
        </Form.Item>
    </Form>

    <DatePicker
        showTime
        allowClear={false}
        size="small"
        placeholder="Reminder Date"        
        disabledDate={disabledDate}
        // Day.js treats dayjs(null) as an invalid input.
        value={selectedReminderDate ? dayjs(selectedReminderDate) : ''}
        onChange={handleReminderDateUpdate}
      />

    <Form
        size="small"
        layout="inline"
        initialValues={{reminderNote: reminderNote}}
        onFinish={(values) => handleReminderNoteUpdate(values.reminderNote)}
    >
        <Form.Item name="reminderNote">
        <Input placeholder="Reminder Note" variant="borderless"/>
        </Form.Item>
    </Form>

    </Space.Compact>
    </Spin>
  );
}

export default ColumnReminderIssue;