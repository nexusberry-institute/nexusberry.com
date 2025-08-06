import React from "react";
import {
  //  Menu,
  //  Dropdown,
  Badge,
  Button,
  Divider,
  Row,
  Col,
} from "antd";
import {
  CaretRightFilled,
  //  DashOutlined
} from "@ant-design/icons";
import { leadStatus } from "@cms/_models/lead";

const ExpandedFilters = ({
  leads,
  handleFiltersChange,
  leadsCount,
}) => {
  // const handleMenuClick = (e) => {
  //   let name = "status";
  //   handleFiltersChange({ name, value: e.key });
  // };

  const handleStatusChange = (name, value) => {
    // console.log("check: ", name, value);
    handleFiltersChange({ name, value });
  };

  const leadCountAll = leads?.length || "0";

  // console.log("leadCountAll: ", leadCountAll);

  const stage = [
    {
      name: "All",
      value: leadStatus.All,
      count: leadCountAll,
      color: "#0A1DEB",
    },
    {
      name: "Unread",
      value: leadStatus.UNREAD,
    },
    {
      name: "Reminder",
      value: leadStatus.REMINDER,
    },
    {
      name: "Package",
      value: leadStatus.PACKAGE,
    },
    {
      name: "Follow-Up",
      value: leadStatus.FOLLOW_UP,
      color: "#0A1DEB",
      count: leadsCount?.followUp,
    },
    {
      name: "Interested",
      value: leadStatus.INTERESTED,
      color: "green",
      count: leadsCount?.interested,
    },
    {
      name: "Attended Demo",
      value: leadStatus.ATTENDED_DEMO,
      color: "yellow",
      count: leadsCount?.attendedDemo,
    },
    {
      name: "Confirmed Paying",
      value: leadStatus.CONFIRMED_PAYING,
      color: "#FA7100",
      count: leadsCount?.confirmedPaying,
    },
    {
      name: "Admitted",
      value: leadStatus.ADMITTED,
      color: "#95451E",
      count: leadsCount?.admitted,
    },
    {
      name: "Refused",
      value: leadStatus.REFUSED,
      color: "red",
      count: leadsCount?.refused,
    },
    {
      name: "Waste",
      value: leadStatus.WASTE,
      color: "red",
      count: leadsCount?.wasted,
    },
  ];

  return (
    <Row align={"middle"} style={{ marginLeft: "8px", marginTop: "-12px" }}>
      {stage.map((item, index) => {
        return (
          <Col key={item.name}>
            {item.value === leadStatus.FOLLOW_UP ? (
              <Divider
                style={{
                  fontWeight: "bold",
                  borderWidth: "2px",
                  borderColor: "black",
                  margin: "6px",
                  // width: "80%",
                }}
                type="vertical"
              />
            ) : null}
            <Button
              size="small"
              type="link"
              onClick={() => handleStatusChange("status", item.value)}
              style={{ fontSize: "13px" }}
            >
              {item.name}
            </Button>
            {item.count ? (
              <>
                <Badge
                  style={{ with: "20px" }}
                  size="small"
                  count={item.count}
                  overflowCount={item.count}
                  showZero
                  color={item.color}
                />
                <CaretRightFilled />
              </>
            ) : null}
          </Col>
        );
      })}
    </Row>
  );
};

export default ExpandedFilters;
