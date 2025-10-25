import React from "react";
import DateFilter from "./FilterComponents/DateFilter";
import CourseSelect from "./FilterComponents/CourseSelect";
import CategorySelect from "./FilterComponents/CategorySelect";
import { Divider, Row, Col } from "antd";
import ExpandedFilters from "./FilterComponents/ExpandedFilters";
const Filter = () => {
  return (
    <div
      style={{
        backgroundColor: "white",
        marginTop: "10px",
        marginBottom: "10px",
      }}
    >
      <Row
        align={"middle"}
        style={{
          height: "30px",
        }}
      >
        <Col span={8}>
          <strong style={{
            }}>Date</strong>
          <DateFilter />
        </Col>
        <Col span={6} offset={4}>
          <strong style={{marginRight:"10px"}}>Category</strong>
          <CategorySelect />
        </Col>
        <Col span={6}>
          <strong style={{marginRight:"10px"}}>Course</strong>
          <CourseSelect />
        </Col>
      </Row>
      <Divider />
        <ExpandedFilters />
    </div>
  );
};
export default Filter;
