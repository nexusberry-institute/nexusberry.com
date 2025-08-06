import React from "react";
import dayjs from "dayjs";
import { DatePicker, Space } from "antd";

const { RangePicker } = DatePicker;

const onRangeChange = (dates, dateStrings) => {
  if (dates) {
    // console.log("From: ", dates[0], ", to: ", dates[1]);
    // console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
  } else {
    // console.log("Clear");
  }
};
const rangePresets = [
  {
    label: "Last 7 Days",
    value: [dayjs().add(-7, "d"), dayjs()],
  },
  {
    label: "Last 14 Days",
    value: [dayjs().add(-14, "d"), dayjs()],
  },
  {
    label: "Last 30 Days",
    value: [dayjs().add(-30, "d"), dayjs()],
  },
  {
    label: "Last 90 Days",
    value: [dayjs().add(-90, "d"), dayjs()],
  },
];
const ReceivedFeeDateFilter = () => (
  <Space direction="horizontal" style={{ padding: "10px" }}>
    <h4>Select Date: </h4>
    <RangePicker
      // value={[new Date(periodStart), new Date(periodEnd)]}
      size={12}
      presets={rangePresets}
      onChange={onRangeChange}
    />
  </Space>
);
export default ReceivedFeeDateFilter;
