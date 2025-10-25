import React from "react";
import { Input, Space } from "antd";
const { Search } = Input;

const onSearch = (value) =>
 console.log(value);
const SearchButton = () => {
  return (
    <Space direction="vertical" style={{ marginLeft: "10px" }}>
      <Search
        size="small"
        placeholder="Mobile/Name/E-mail"
        onSearch={onSearch}
        enterButton
      />
    </Space>
  );
};
export default SearchButton;
