"use client";
import React, { useState } from "react";
import { Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const SearchBar = ({ handleFiltersChange, setPagination }) => {
  const [searchType, setSearchType] = useState("id");

  const handleSearch = (value) => {
    let name = "search";
    handleFiltersChange({
      name: name,
      value: { type: searchType, value: value },
    });
    setPagination({ page: 1, pageSize: 20 });
  };

  const handleTypeChange = (value) => {
    setSearchType(value);
  };

  const handleClear = () => {
    setSearchType("id");
    handleSearch("");
  };

  const handleKeyUp = (e) => {
    if (e.keyCode === 8 && e.target.value === "") {
      handleClear();
    }
  };

  return (
    <>
      <Space direction="vertical" style={{ marginLeft: "0px" }}>
        <Search
          style={{ width: "350px" }}
          placeholder={`Enter ${searchType}`}
          enterButton="Search"
          onSearch={handleSearch}
          onClear={handleClear}
          onKeyUp={handleKeyUp}
          size="small"
          allowClear
          prefix={<SearchOutlined />}
          addonBefore={
            <Select
              value={searchType}
              onChange={handleTypeChange}
              style={{ width: "130px" }}
            >
              <Option value="id">Installment ID</Option>
              <Option value="name">Student Name</Option>
              {/* <Option value="mobile">Phone</Option> */}
            </Select>
          }
        />
      </Space>
    </>
  );
};

export default SearchBar;
