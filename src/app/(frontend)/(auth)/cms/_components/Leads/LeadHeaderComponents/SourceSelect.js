import React, { useState } from "react";
import { Select, Space } from "antd";

const SourceSelect = ({ handleFiltersChange }) => {

  const[source, setSource]=useState("all");
  const onSelect = (value) => {
    value = value ?? "all";
    setSource(value);
    handleFiltersChange({ name: "source", value });
  };

  return (
    <>
      <Space wrap>
        <Select
          placeholder="source"
          value={source}
          dropdownStyle={{ width: 120 }}
          size="small"
          style={{
            width: 120,
          }}
          allowClear
          onSelect={onSelect}
          options={[
            {
              value: "all",
              label: "All",
            }
          ]}
        />
      </Space>
    </>
  );
};

export default SourceSelect;
