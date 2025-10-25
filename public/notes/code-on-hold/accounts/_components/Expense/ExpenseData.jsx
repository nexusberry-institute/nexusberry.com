import React from "react";
import { Table, Spin } from "antd";
//
import { expenseTypes } from "@accounts/_enums/expense-types";
import { months } from "@accounts/_enums/months";
//
import useGetExpensesApi from "@accounts/_hooks/Expense/useGetExpensesApi";

const ExpenseData = ({ selectedType, selectedMonth, searchedYear }) => {
  const { data, isLoading, error } = useGetExpensesApi(
    selectedType,
    selectedMonth,
    searchedYear
  );

  const columns = [
    {
      title: "Sr.# | id",
      dataIndex: "id",
      key: "sr",
      render: (text, record) => (
        <span>
          {record.sr} <b>|</b> {record.id}
        </span>
      ),
    },
    {
      title: "Month | Year | Paymnet Date ",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          {`${record.month} `} <b>|</b> {`${record.year}`} <b>|</b>{" "}
          {`${record.paymnetDate}`}
        </span>
      ),
      filters: months.map(month => ({
        text: month.label,
        value: month.value,
      })),
      onFilter: (value, record) => record.month === value,
    },
    {
      title: "Type | Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <span>{`${record.type}`}  | {text}</span>
      ),
      filters: expenseTypes.map(expenseType => ({
        text: expenseType.label,
        value: expenseType.value,
      })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Amount | Medium",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          Rs. {`${record.amount} `} <b>|</b>{" "}
          {`${record.medium}`}
        </span>
      ),
    },

    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
  ];

  if(error)
    return <h1>Error: {error.message}</h1>

  return (
    <>
      <div style={{ marginRight: "10px", marginLeft: "10px" }}>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "50vh",
            }}
          >
            <Spin />
          </div>
        ) : data && data.length > 0 ? (
          <div>
            <Table columns={columns} dataSource={data} />
          </div>
        ) : (
          <h2 style={{ textAlign: "center", marginTop: "20px" }}>
            Data not found!
          </h2>
        )}
      </div>
    </>
  );
};

export default ExpenseData;
