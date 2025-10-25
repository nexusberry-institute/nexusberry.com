import React, { useState } from "react";
import { Input, Space, Select } from "antd";

const { Search } = Input;
const { Option } = Select;

const LeadSearch = ({ handleFiltersChange }) => {
  const [searchType, setSearchType] = useState("mobile");

  const handleSearch = (value) => {
    handleFiltersChange({
      name: "search",
      value: { type: searchType, value },
    });
  };

  const handleTypeChange = (value) => {
    setSearchType(value);
  };

  return (
    <Space direction="vertical" style={{ marginLeft: "4px" }}>
      <Search
        size="small"
        placeholder={`Enter ${searchType}`}
        onSearch={handleSearch}
        enterButton
        allowClear
        style={{ width: "100%" }}
        addonBefore={
          <Select
            defaultValue={searchType}
            onChange={handleTypeChange}
            style={{ width: "100px" }}
          >
            <Option value="mobile">Mobile</Option>
            <Option value="name">Name</Option>
            <Option value="email">Email</Option>
            <Option value="id">ID</Option>
          </Select>
        }
      />
    </Space>
  );
};

export default  React.memo(LeadSearch);
