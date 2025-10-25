"use client";
import React, { useState } from "react";
import { Spin, Typography, message } from "antd";
import { useQueryClient } from "react-query";
//
import usePutInstallmentApi from "@accounts/_hooks/Fee/usePutInstallmentApi";

const { Paragraph } = Typography;

const UpdateInstallmentNote = ({ note, rowData }) => {
  // console.log("note:- ", note);
  const [editableStr, setEditableStr] = useState(note);
  const [ellipsis, setEllipsis] = useState(true);
  const mutation = usePutInstallmentApi();

  const queryClient = useQueryClient();

  const handleStaffNote = (staffNote, id) => {
    mutation.mutate(
      { id, data: { note: staffNote } },
      {
        onSuccess: (data) => {
          message.success("Installment Note Updated successfully!");
          setEllipsis(true);
          // queryClient.invalidateQueries(["use-get-fee-pending-api"]);
        },
        onError: (error) => {
          const msg = error.response?.data?.error?.message || error.message;
          message.error(msg);
          setEditableStr("");
        },
      }
    );
  };

  const onChange = (event) => {
    setEditableStr(event);
    setEllipsis(true);
    handleStaffNote(event, rowData.id);
  };

  const onSave = () => {
    setEllipsis(true);
  };
  if (mutation.isLoading) {
    return <Spin />;
  } else
    return (
      <div className="shape-container">
        <Paragraph
          style={{ float: "right", marginLeft: "10px" }}
          editable={{
            onChange: onChange,
            onEnd: onSave,
          }}
          ellipsis={
            ellipsis
              ? {
                  rows: 2,
                  expandable: true,
                  symbol: "more",
                  onChange: () => {
                    setEllipsis(true);
                  },
                }
              : false
          }
        >
          {editableStr}
        </Paragraph>
      </div>
    );
};
export default UpdateInstallmentNote;
