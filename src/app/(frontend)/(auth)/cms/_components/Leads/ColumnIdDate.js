import React from "react";
import {Tooltip, Space, Typography} from "antd";

const { Text } = Typography;

function ColumnIdDate(props){
    let {rowData, onOpenDrawer} = props;
    let {date, activity, id, city, province, country, education} = rowData;
    const interations = activity?.length ?? 0;
      
    return (
      <Tooltip
        placement="right"
        title={
          <span>{activity && activity.reverse().map((a, i) => <span key={i}>{a}<hr /> </span>)}</span>}
          color="blue"
        >
      <Space.Compact direction="vertical" style={{ cursor: "pointer" }}
      onClick={() => onOpenDrawer(rowData)}>
        <Text keyboard strong type={interations < 3 ? "danger" : ""}>ID:{id}, activity:{interations}</Text>
        <Text strong>{date}</Text>
        <Text> {city || "city?"}, {province || "province?"}, {country || "country?"}</Text>

        {education && (
              <Text type="secondary">
                {education.length > 30 ? education.slice(0, 30) + "..": education}
              </Text>
          )}

    </Space.Compact>
      </Tooltip>
  )
    }

export default ColumnIdDate;
