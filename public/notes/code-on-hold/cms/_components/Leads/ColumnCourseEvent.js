import React from "react";
import {Space, Typography, Tooltip} from "antd";

const { Text } = Typography;
const getStr = str => str.length <= 25 ? str : str.slice(0, 26) + "..";

// course, category, event, source
function ColumnCourseEvent(props){
    const {course, category, event, source} = props.rowData;
    
    return (
      <Tooltip
        placement="right"
        title={
          <span>course: {course} <hr />
          category: {category} <hr /> 
          event: {event} <hr /> 
          source: {source}</span>}
        color="blue"
      >
      <Space.Compact direction="vertical">
        
        <Text>{(course && getStr(course)) || "course?"}</Text>
        <Text type="secondary">{(category && getStr(category)) || "category?"}</Text>
        <Text mark>{(event && getStr(event)) || "event?"}</Text>
        <Text type="success">{(source && getStr(source)) || "source?"}</Text>
      </Space.Compact>
        </Tooltip>
    );
  };

  export default ColumnCourseEvent;