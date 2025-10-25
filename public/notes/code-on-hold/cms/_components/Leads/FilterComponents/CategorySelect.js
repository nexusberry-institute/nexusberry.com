import { Select } from "antd";
import UseGetCategoriesApi from "@cms/_hooks/leads/UseGetCategoriesApi";
// import { useState } from "react";
const { Option } = Select;

const CategorySelect = ({ selectedCategory, handleFiltersChange }) => {
  const { categories } = UseGetCategoriesApi();

  const handleCategoryChange = (value) => {
    let name = "category";

    if (value) {
      handleFiltersChange({ name, value });
    } else {
      let value = "all";
      handleFiltersChange({ name, value });
    }
  };

  return (
    <Select
      allowClear
      size="small"
      placeholder="Category"
      style={{ width: "100%" }}
      // dropdownStyle={{ width: "15%" }}
      popupMatchSelectWidth={false}
      onChange={handleCategoryChange}
      value={selectedCategory}
    >
      <Option value="all">All</Option>
      {categories?.map((category) => (
        <Option key={category.id} value={category.slug}>
          {category.nick}
        </Option>
      ))}
    </Select>
  );
};

export default CategorySelect;
