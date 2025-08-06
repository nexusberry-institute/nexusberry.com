"use client";
import React, { useState } from "react";
import ExpenseFilters from "@accounts/_components/Expense/ExpenseFilters";
import ExpenseData from "@accounts/_components/Expense/ExpenseData";

const Expense = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [searchedYear, setSearchedYear] = useState("");

  const handleTypeChange = (selectedType) => {
    setSelectedType(selectedType);
  };

  const handleMonthChange = (selectedMonth) => {
    setSelectedMonth(selectedMonth);
  };

  const handleSearchClick = () => {
    setSearchedYear(searchedYear);
    console.log("searchedYear", searchedYear);
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Expenses</h1>
      <ExpenseFilters
        handleTypeChange={handleTypeChange}
        selectedType={selectedType}
        handleMonthChange={handleMonthChange}
        selectedMonth={selectedMonth}
        handleSearchClick={handleSearchClick}
        setSearchedYear={setSearchedYear}
      />
      <ExpenseData
        selectedType={selectedType}
        selectedMonth={selectedMonth}
        searchedYear={searchedYear}
      />
    </div>
  );
};

export default Expense;
