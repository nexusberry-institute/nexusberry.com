import { CloseCircleOutlined } from "@ant-design/icons";
import React from "react";
import { Badge } from "antd";

const ShowClickFilters = ({
  selectedFiter,
  filterShowStatus,
  handleFiltersChange,
}) => {
  // console.log("filterShowStatus: ", filterShowStatus);
  // console.log("filerIsSelected: ", selectedFiter);

  const handleChangesFilters = (name, value) => {
    // console.log(name, value);
    handleFiltersChange({ name, value });
  };

  return (
    <>
      {filterShowStatus && selectedFiter?.status !== "all" ? (
        <span
          style={{
            background: "#c7c5c1",
            borderRadius: "10px",
            paddingRight: "4px",
            paddingLeft: "4px",
            paddingBottom: "2px",
            marginRight: "10px",
          }}
        >
          <Badge size="small">
            <small> {selectedFiter?.status}</small>
            <CloseCircleOutlined
              style={{ fontSize: "10px" }}
              onClick={() => handleChangesFilters("status", "all")}
            />
          </Badge>
        </span>
      ) : null}
      {filterShowStatus && selectedFiter?.category !== "all" ? (
        <span
          style={{
            background: "#c7c5c1",
            borderRadius: "10px",
            paddingRight: "4px",
            paddingLeft: "4px",
            paddingBottom: "2px",
            marginRight: "10px",
          }}
        >
          <Badge size="small">
            <small> {selectedFiter?.category}</small>
            <CloseCircleOutlined
              style={{ fontSize: "10px" }}
              onClick={() => handleChangesFilters("category", "all")}
            />
          </Badge>
        </span>
      ) : null}
      {filterShowStatus && selectedFiter?.course !== "all" ? (
        <span
          style={{
            background: "#c7c5c1",
            borderRadius: "10px",
            paddingRight: "4px",
            paddingLeft: "4px",
            paddingBottom: "2px",
            marginRight: "10px",
          }}
        >
          <Badge size="small">
            <small>{selectedFiter?.course}</small>
            <CloseCircleOutlined
              style={{ fontSize: "10px" }}
              onClick={() => handleChangesFilters("course", "all")}
            />
          </Badge>
        </span>
      ) : null}
      {filterShowStatus && selectedFiter?.source !== "all" ? (
        <span
          style={{
            background: "#c7c5c1",
            borderRadius: "10px",
            paddingRight: "4px",
            paddingLeft: "4px",
            paddingBottom: "2px",
            marginRight: "10px",
          }}
        >
          <Badge size="small">
            <small>{selectedFiter?.source}</small>
            <CloseCircleOutlined
              style={{ fontSize: "10px" }}
              onClick={() => handleChangesFilters("source", "all")}
            />
          </Badge>
        </span>
      ) : null}

      {filterShowStatus && selectedFiter?.event !== "all" ? (
        <span
          style={{
            background: "#c7c5c1",
            borderRadius: "10px",
            paddingRight: "4px",
            paddingLeft: "4px",
            paddingBottom: "2px",
            marginRight: "10px",
          }}
        >
          <Badge size="small">
            <small> {selectedFiter?.event}</small>
            <CloseCircleOutlined style={{ fontSize: "10px" }} />
            onClick={() => handleChangesFilters("event", "all")}
          </Badge>
        </span>
      ) : null}

      {filterShowStatus && selectedFiter?.assignedTo !== "all" ? (
        <span
          style={{
            background: "#c7c5c1",
            borderRadius: "10px",
            paddingRight: "4px",
            paddingLeft: "4px",
            paddingBottom: "2px",
            marginRight: "10px",
          }}
        >
          <Badge size="small">
            <small>{selectedFiter?.assignedTo}</small>
            <CloseCircleOutlined
              onClick={() => handleChangesFilters("assignedTo", "all")}
            />
          </Badge>
        </span>
      ) : null}

      {selectedFiter?.status === "all" &&
      selectedFiter?.category === "all" &&
      selectedFiter?.course === "all" &&
      selectedFiter?.source === "all" &&
      selectedFiter?.event === "all" &&
      selectedFiter?.assignedTo === "all" ? null : (
        <span
          style={{
            background: "#c7c5c1",
            borderRadius: "10px",
            paddingRight: "4px",
            paddingLeft: "4px",
            paddingBottom: "2px",
            marginRight: "10px",
          }}
        >
          <Badge size="small">
            <small>Reset Filters</small>
            <CloseCircleOutlined
              style={{ fontSize: "10px" }}
              // style={{fontSize:"10px"}}
              onClick={() => handleChangesFilters("rest", "all")}
            />
          </Badge>
        </span>
      )}
    </>
  );
};

export default ShowClickFilters;
