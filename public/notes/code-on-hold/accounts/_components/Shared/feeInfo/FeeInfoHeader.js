import React from "react";
import { Col, Row, Select } from "antd";

// custom
import CourseSelectFilter from "../CourseSelectFilter";
import SearchBar from "../SearchBar";
import DateFilter from "../../Shared/DateFilter";
import CSVDownload from "../CSVDownload";

// lib
import { feeStatusOptions } from "@accounts/_enums/fee-status";

const FeeInfoHeader = ({
  title,
  filters,
  handleFiltersChange,
  handleDateChange,
  hasSelected,
  setPagination,
  selectedRowKeys,
  handleDownloadCSV,
  csvData,
  fileName,
}) => {
  return (
    <div
    style={{
      backgroundColor: "#fff",
      margin: "5px",
      border: "1px solid #f5f5f5",
      borderRadius: "8px",
    }}
    >
      <Row justify="space-between" align="middle">
        <Col span={12}>
          <h3>{title}</h3>
        </Col>
        <Col span={8}>
          <SearchBar
            setPagination={setPagination}
            handleFiltersChange={handleFiltersChange}
          />
        </Col>
        <Col span={4}>
          <CSVDownload
            fileName={fileName}
            handleDownloadCSV={handleDownloadCSV}
            csvData={csvData}
          />
        </Col>
      </Row>

      <Row justify="space-evenly" align="middle">
        <Col span={10}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <h4 style={{ marginLeft: "5px", marginTop: "2px" }}>Date: </h4>{" "}
            &nbsp;&nbsp;&nbsp;
            <DateFilter
              periodStart={filters.periodStart}
              periodEnd={filters.periodEnd}
              handleDateChange={handleDateChange}
            />
          </div>
        </Col>
        <Col span={6}>
          <CourseSelectFilter
            setPagination={setPagination}
            selectedCourse={filters.course}
            handleFiltersChange={handleFiltersChange}
          />
        </Col>

        <Col span={6}>
          <Select
            style={{
              width: 120,
            }}
            value={filters.status}
            onChange={(value) => handleFiltersChange({ name: "status", value })}
            options={feeStatusOptions}
          />
        </Col>
      </Row>

      <span>
        {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
      </span>
    </div>
  );
};

export default FeeInfoHeader;
