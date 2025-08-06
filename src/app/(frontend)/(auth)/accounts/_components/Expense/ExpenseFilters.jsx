import React from "react";
import { Col, Row, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
//
import { expenseTypes } from "@accounts/_enums/expense-types";
import { months } from "@accounts/_enums/months";
//
import useGetExpensesApi from "@accounts/_hooks/Expense/useGetExpensesApi";

const { Option } = Select;

const ExpenseFilters = ({
  handleTypeChange,
  selectedType,
  handleMonthChange,
  selectedMonth,
  handleSearchClick,
  setSearchedYear,
  searchedYear,
}) => {
  const { data } = useGetExpensesApi();

  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          margin: "0 10px 10px 10px",
        }}
      >
        <Row
          align={"middle"}
          style={{
            marginLeft: "15px",
            paddingTop: "15px",
            paddingBottom: "15px",
            marginTop: "15px",
          }}
        >
          <Col span={2}>
            <strong>Type</strong>
          </Col>
          <Col span={6}>
            <Select
              allowClear
              defaultValue="all"
              style={{ width: "100%", marginLeft: "-50px" }}
              onChange={handleTypeChange}
              value={selectedType === undefined ? "All" : selectedType}
            >
              <Option value="all">All</Option>
              {expenseTypes.map(et => <Option key={et.label}value={et.value}>{et.label}</Option>)}
            </Select>
          </Col>

          <Col span={2}>
            <strong style={{ marginLeft: "50px" }}>Month</strong>
          </Col>
          <Col span={4}>
            <Select
              allowClear
              defaultValue="all"
              style={{ width: "100%", marginLeft: "10px" }}
              onChange={handleMonthChange}
              value={selectedMonth === undefined ? "All" : selectedMonth}
            >
              <Option value="all">All</Option>
              {months.map(month => (
                <Option key={month.value} value={month.value}>
                  {month.label}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={3}>
            <strong style={{ marginLeft: "153px" }}>Year</strong>
          </Col>
          <Col span={3}>
            <Input
              allowClear
              id="searchInput"
              style={{ width: "260px", marginLeft: "50px" }}
              placeholder={"Enter Year"}
              size="middle"
              onChange={(e) => setSearchedYear(e.target.value)}
              value={searchedYear}
              prefix={<SearchOutlined />}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ExpenseFilters;
