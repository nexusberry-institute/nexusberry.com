import React from "react";
import { Divider, Row, Col } from "antd";
// custom
import DateFilter from "./FilterComponents/DateFilter";
// import CourseSelect from "./FilterComponents/CourseSelect";
// import CategorySelect from "./FilterComponents/CategorySelect";
// import ExpandedFilters from "./FilterComponents/ExpandedFilters";
// import ShowClickFilters from "./FilterComponents/ShowClickFilters";

// date filter, reminder filters
const LeadTableFilters = ({
  showSelectedFilters,
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
        }}
      >
        <Row
          // gutter={23}
          align={"middle"}
          style={{
            height: "12px",
            // marginRight: "10px",
            marginLeft: "15px",
            paddingTop: "15px",
            marginTop: "-13px",
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
            />
          </Col>
        </Row>

        <Divider />
        {/* <ExpandedFilters
          selectedLeadStatus={filters.status}
          handleFiltersChange={handleFiltersChange}
          leadsCount={leadsCount}
          leads={leads}
        /> */}
      </div>

      {/* <ShowClickFilters
        selectedFiter={filters}
        filterShowStatus={showSelectedFilters}
        handleFiltersChange={handleFiltersChange}
      /> */}
    </>
  );
};

export default LeadTableFilters;
