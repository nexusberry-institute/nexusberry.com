import React from 'react';
import { Select } from "antd";
// import useGetEventApi from "../../../hooks/leads/useGetEventApi";

const { Option } = Select;

const EventSelect = ({ handleFiltersChange }) => {
  const [event, setEvent] = React.useState("all")
  // const { events } = useGetEventApi();
  const events = [];

  const onSelect = (value) => {
    value = value ?? "all";
    setEvent(value);
    handleFiltersChange({ name: "assignedTo", value });
  };

  return (
    <Select
      size="small"
      placeholder="Event"
      value={event}
      onSelect={onSelect}
      dropdownStyle={{ width: 200 }}
      style={{ width: 220 }}
      allowClear
    >
      <Option value="all">All</Option>
      {events?.map((event) => (
        <Option key={event.id} value={event.slug}>
          {event.title}
        </Option>
      ))}
    </Select>
  );
};
export default React.memo(EventSelect);
