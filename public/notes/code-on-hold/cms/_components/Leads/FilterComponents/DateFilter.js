import React from "react";
import dayjs from "dayjs";
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;

const rangePresets = [
  {
    label: "Today",
    value: [dayjs(), dayjs()],
  },
  {
    label: "Yesterday",
    value: [dayjs().add(-1, "d"), dayjs().add(-1, "d")],
  },
  {
    label: "Last 14 Days",
    value: [dayjs().add(-14, "d"), dayjs()],
  },
  {
    label: "This Month",
    value: [dayjs().startOf("month"), dayjs()],
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

const DateFilter = ({ periodStart, periodEnd, handleDateChange }) => {
  const onRangeChange = (dates, dateStrings) => {
    // console.log("dateStrings: ", dateStrings);
    let periodStartName = "periodStart";
    let periodEndName = "periodEnd";

    if (dateStrings?.length) {
      handleDateChange({
        periodStartName,
        periodStart: dateStrings[0],
        periodEndName: periodEndName,
        periodEnd: dateStrings[1],
      });
    } else {
      handleDateChange({
        periodStartName,
        periodStart: null,
        periodEndName,
        periodEnd: null,
      });
    }
  };

  return (
    <Space direction="vertical">
      <RangePicker
        // value={[new Date(periodStart), new Date(periodEnd)]}
        size="small"
        presets={rangePresets}
        onChange={onRangeChange}
      />
    </Space>
  );
};
export default DateFilter;
