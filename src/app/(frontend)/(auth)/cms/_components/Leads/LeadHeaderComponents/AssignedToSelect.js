import { useState } from "react";
import React from 'react'
import useGetStaffApi from "@cms/_hooks/leads/UseGetStaff";
import { Select } from "antd";
const { Option } = Select;

const AssignedToSelect = (
  { handleFiltersChange }
  ) => {
    const [assignedTo, setAssignedTo] = useState("all")
    const { staffList } = useGetStaffApi();

  const onSelect = (value) => {
    value = value ?? "all";
    setAssignedTo(value);
    handleFiltersChange({ name: "assignedTo", value });
  };

  return (
    <>
      <Select
        size="small"
        placeholder="Assigned to"
        value={assignedTo}
        onSelect={onSelect}
        dropdownStyle={{ width: 140 }}
        style={{ width: 220}}
        allowClear
      >
        <Option value="all">All</Option>
        {staffList?.map((staff) => (
          <Option key={staff.id} value={staff.name}>
            {staff.name}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default React.memo(AssignedToSelect);
