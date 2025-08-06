import { Badge, Spin, Table } from "antd";
import React from "react";

const DashboardTable = ({
  leadsByDate,
  leadsByStageCount,
  isLoading,
  isError,
  error,
}) => {
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      width: "14%",
      render: (date, rowData) => (
        <span>
          <Badge count={rowData.date} overflowCount={999999} color="#faad14" />
        </span>
      ),
    },
    {
      title: "ONE_FOLLOW_UP",
      dataIndex: "date",
      width: "14%",
      render: (date, rowData) => {
        // console.log("rowData", rowData);
        const stageOneTotal =
          rowData.stageCounts.ONE_FOLLOW_UP +
          rowData.stageCounts.ONE_FOLLOW_UP_NOT_RESPONDING;
        return (
          <span>
            <Badge
              count={stageOneTotal}
              overflowCount={999999}
              showZero={true}
              color="blue"
            />
          </span>
        );
      },
    },
    {
      title: "TWO_INTERESTED",
      dataIndex: "date",
      width: "14%",
      render: (date, rowData) => {
        // console.log("rowData", rowData);
        const stageTotal =
          rowData.stageCounts.TWO_INTERESTED_LOW +
          rowData.stageCounts.TWO_INTERESTED_MEDIUM +
          rowData.stageCounts.TWO_INTERESTED_HIGH;
        //   console.log("stageTotal",stageTotal)
        return <span><Badge
        count={stageTotal}
        overflowCount={999999}
        showZero={true}
        color="Green"
      />
        </span>;
      },
    },
    {
      title: "THREE_ATTENDED_DEMO",
      dataIndex: "date",
      width: "14%",
      render: (date, rowData) => {
        //   console.log("rowData", rowData);
        return <span>
        <Badge
        count={rowData.stageCounts.THREE_ATTENDED_DEMO}
        overflowCount={999999}
        showZero={true}
        color="yellow"
      /></span>;
      },
    },
    {
      title: "FOUR_CONFIRMED_PAYING",
      dataIndex: "date",
      width: "14%",
      render: (date, rowData) => {
        //   console.log("rowData", rowData);
        return <span>
         <Badge
        count={rowData.stageCounts.FOUR_CONFIRMED_PAYING}
        overflowCount={999999}
        showZero={true}
        color="orange"
      /></span>;
      },
    },
    {
      title: "FIVE_ADMITTED",
      dataIndex: "date",
      width: "14%",
      render: (date, rowData) => {
        //   console.log("rowData", rowData);
        return <span>
         <Badge
        count={rowData.stageCounts.FIVE_ADMITTED}
        overflowCount={999999}
        showZero={true}
        color="brown"
      />
       </span>;
      },
    },
    {
      title: "FOLLOWUP_REFUSED",
      dataIndex: "date",
      width: "14%",
      render: (date, rowData) => {
        //   console.log("rowData", rowData);
        const stageFinalTotal =
          rowData.stageCounts.NO_FOLLOWUP_REFUSED +
          rowData.stageCounts.NO_FOLLOWUP_WASTE;

        return <span>
         <Badge
        count={stageFinalTotal}
        overflowCount={999999}
        showZero={true}
        color="red"
      /></span>;
      },
    },
  ];
  let view;
  if (isLoading) {
    view = <Spin />;
  } else if (isError) {
    view = <p>{error.message || error?.response?.data?.error?.message}</p>;
  } else if (!leadsByStageCount.length) {
    view = 
    <Badge count="No leads in Selected Date"  style={{ backgroundColor: 'green' , marginLeft:"20px",
  marginTop:"10ppx"}} />
  } else {
    view = (
      <>
        <Table
          style={{ height: "100%", margin: "10px" }}
          size="small"
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={leadsByStageCount}
          pagination={false}
          bordered={true}
        />
      </>
    );
  }
  return <>{view}</>;
};

export default DashboardTable;
