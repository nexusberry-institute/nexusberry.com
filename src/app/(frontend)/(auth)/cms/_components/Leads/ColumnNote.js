import React, { useEffect, useState } from "react";
import { Spin, Typography, message, Space, Select, Flex } from "antd";
//api
import usePutLeadApi from "@cms/_hooks/leads/usePutLeadApi";
import useShowStrapiError from "../uiHooks/useShowStrapiError";
import { makeActivityJson } from "@cms/_lib/makeActivityJson";
import { assignToOptions } from "@cms/_lib/assignToOptions";

const { Paragraph } = Typography;

const ColumnNote = ({ rowData }) => {
  const {id, notes, assignTo, activity} = rowData;
  
  const [editableStr, setEditableStr] = useState(rowData.notes);
  const [ellipsis, setEllipsis] = useState(true);

  const { showErrModel, RenderErrModel } = useShowStrapiError();
  const mutation = usePutLeadApi();

  useEffect(() => {
    setEditableStr(notes);
  }, [notes]);

  const handleAssignToUpdate = (newAssignTo) => {
    mutation.mutate(
      {
        id,
        data: {
          assignTo: newAssignTo,
          activity: makeActivityJson({
            activity,
            what: "AssignTo",
            content: newAssignTo
          }),
        },
      },
      {
        onSuccess: _ => message.success("Updat sucess!"),
        onError: error => message.error(error.message)
      }
    );
  };

  const handleNotesUpdate = (newNotes) => {
    if (newNotes === notes) { // same text no change
      setEllipsis(true);
      return;
    }

    mutation.mutate(
      { id, data: { 
        notes: newNotes,
        activity: makeActivityJson({
          activity: activity,
          what: "notes",
          content: newNotes
        })
        } 
      },
      {
        onSuccess: (data) => {
          message.success("Staff Note Updated successfully!");
          setEllipsis(true);
        },
        onError: (error) => {
          showErrModel(error);
          setEditableStr(notes); // reset note
        },
      }
    );
  };

  const onChange = (newNotes) => {
    setEditableStr(newNotes);
    setEllipsis(true);
    handleNotesUpdate(newNotes);
  };

  return (
    <>
      <Spin spinning={mutation.isLoading}>
      <Flex vertical justify="space-between">
        <Select
          size="small"
          variant="borderless"
          popupMatchSelectWidth={false}
          defaultValue={assignTo}
          value={assignTo}
          onChange={handleAssignToUpdate}
          options={assignToOptions}
        />

        <Paragraph
          editable={{
            onChange: onChange,
            onEnd: () => setEllipsis(true),
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
        </Flex>
      </Spin>

      <RenderErrModel title={"Error Updating Note for " + id}/>
</>
  );
};

export default ColumnNote;
