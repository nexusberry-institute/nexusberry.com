"use client"
import React, { useState } from "react";
import { Input, Space, Select } from "antd";

const { Search } = Input;
const { Option } = Select;

const StudentSearch = ({ handleFiltersChange }) => {
  const [searchType, setSearchType] = useState("mobile");

  const handleSearch = (value) => {
    handleFiltersChange({
      name: "search",
      value: { type: searchType, value: value },
    });
  };

  const handleTypeChange = (value) => {
    // console.log("type Value in Lead Search",value)
    setSearchType(value);
  };

  return (
    <Space direction="vertical" style={{ marginLeft: "4px" }}>
      <Search
        size="small"
        placeholder={`search student by ${searchType}`}
        onSearch={handleSearch}
        enterButton
        allowClear
        style={{ width: "100%" }}
        addonBefore={
          <Select value={searchType} onChange={handleTypeChange}>
            <Option value="mobile">Mobile</Option>
            <Option value="name">Name</Option>
            <Option value="id">ID</Option>
            <Option value="email">Email</Option>
          </Select>
        }
      />
    </Space>
  );
};

export default StudentSearch;
