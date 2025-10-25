import React from "react";
import { Row, Col, Button } from "antd";
// custom
import LeadSearch from "./LeadHeaderComponents/LeadSearch";
import EventSelect from "./LeadHeaderComponents/EventSelect";
import SourceSelect from "./LeadHeaderComponents/SourceSelect";
import AddNewLeadDrawer from "./LeadHeaderComponents/AddNewLeadDrawer";

// 5 things in top row
// refresh
// search
// coordinating selects: course | category | event | source | city | province | country | assignTo | payment plan (has or not) | issue (has or not) | gender | hostel | online | query | education

// add new lead
// notifications to staff by director

const LeadHeader = ({handleFiltersChange}) => {
  return (
    <Row align={"middle"}>
      <Col className="gutter-row" span={2}>
        <Button
          type="link"
          size="small"
          style={{
            color: "black",
          }}
          onClick={() => {
            window.location.reload(); // link to /leads
          }}
        >
          <strong>Refresh</strong>
        </Button>
      </Col>
      <Col span={6}>
        <LeadSearch handleFiltersChange={handleFiltersChange} />
      </Col>
      <Col
        className="rest-buttons"
        span={15}
        offset={1}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        
        <strong
          style={{
            color: "black",
            alignContent: "center",
            marginLeft: "10px",
            marginTop: "2px",
            marginRight: "4px",
          }}
        >
          Select Field
        </strong>
        
        <EventSelect handleFiltersChange={handleFiltersChange} />
        <strong
          style={{
            color: "black",
            alignContent: "center",
            marginTop: "2px",
            marginLeft: "10px",
            marginRight: "4px",
          }}
        >
          Select Value
        </strong>
        
        <SourceSelect handleFiltersChange={handleFiltersChange} />
        
        <AddNewLeadDrawer />
      </Col>
    </Row>
  );
};
export default LeadHeader;
