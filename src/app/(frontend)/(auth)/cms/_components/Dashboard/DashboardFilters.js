import { Col, Row } from "antd";
import React from "react";
import DateFilter from "../Leads/FilterComponents/DateFilter";
import CategorySelect from "../Leads/FilterComponents/CategorySelect";
import CourseSelect from "../Leads/FilterComponents/CourseSelect";

const DashboardFilters = ({
  filters,
  handleFiltersChange,
  handleDateChange,
  leadsCount,
  leads,
}) => {
  
  return (
    <>
      <div
        style={{
          backgroundColor: "white",
          marginRight: "10px",
          marginLeft: "10px",
        }}
      >
        <Row
          // gutter={23}
          align={"middle"}
          style={{
            //   height: "40p",

            // marginRight: "10px",
            marginLeft: "15px",
            paddingTop: "15px",
            paddingBottom: "15px",
            marginTop: "15px",
          }}
        >
          <Col span={1}>
            <strong style={{ marginRight: "3px" }}>Date</strong>
          </Col>
          <Col span={7}>
            <DateFilter
              periodStart={filters.periodStart}
              periodEnd={filters.periodEnd}
              handleDateChange={handleDateChange}
              defaultValue ={new Date().toISOString().split('T')[0]}
              required={true}
            />
          </Col>
          <Col span={1.5} offset={5}>
            <strong style={{ marginRight: "4px" }}>Category</strong>
          </Col>
          <Col span={4}>
            <CategorySelect
              selectedCategory={filters.category}
              handleFiltersChange={handleFiltersChange}
            />
          </Col>
          <Col span={1}>
            <strong style={{ marginRight: "4px", marginLeft: "16px" }}>
              Course
            </strong>
          </Col>
          <Col span={4} style={{ marginLeft: "19px" }}>
            <CourseSelect
              selectedCourse={filters.course}
              handleFiltersChange={handleFiltersChange}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DashboardFilters;
