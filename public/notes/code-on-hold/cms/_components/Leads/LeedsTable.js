import React, {useState} from "react";
import {
  Table,
  Pagination,
  Skeleton
} from "antd";

// columns (6)
import ColumnIdDate from "./ColumnIdDate";
import ColumnInfoMessage from "./ColumnInfoMessage";
import ColumnCourseEvent from "./ColumnCourseEvent";
import ColumnReminderIssue from "./ColumnReminderIssue";
import ColumnStagePaymentPlan from "./ColumnStagePaymentPlan";
import ColumnNote from "./ColumnNote";

// custom
import useGetColumnSearchFilter from "../uiHooks/useGetColumnSearchFilter";
import CSVDownload from "@cms/_components/Shared/CSVDownload";
import EditLeadDetailDrawer from "./EditLeadDetail";

// lib
import {categoryOptions} from "@cms/_lib/categoryOptions";
import { leadStages } from "@cms/_lib/leadStages";
import { interestLevels } from "@cms/_lib/interestLevels";
import { assignToOptions } from "@cms/_lib/assignToOptions";
import { DEFAULT_PAGE_SIZE } from "@cms/_settings/api";

//api
import useGetLeadsApi from "@cms/_hooks/leads/useGetLeadsApi";

const LeedsTable = ({filters}) => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [open, setOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const {getColumnSearchProps} = useGetColumnSearchFilter();

  const {
    leads,
    apiPagination,
    isLoading,
    isError,
    error,
  } = useGetLeadsApi({
    page: pagination.page,
    pageSize: pagination.pageSize,
    filters,
  });

  const onOpenDrawer = (lead) => {
    setSelectedLead(lead);
    setOpen(true);
  }

  const columns = [
    {// Sr. number
      title: "Sr.#",
      dataIndex: "id",
      width: "4%",
      render: (_, rowData, index) => <span>{(pagination.page - 1) * pagination.pageSize + index+1}</span>
    },
    {// ID | Date column
      title: "ID | Date",
      dataIndex: "date",
      width: "16%",
      sorter: (rowa, rowb) => {
        const activityA = rowa.activity?.length ?? 0;
        const activityB = rowb.activity?.length ?? 0;
        return activityB - activityA;
      },
      sortDirections: ['descend', 'ascend'],
      render: (_, rowData) => <ColumnIdDate rowData={rowData} onOpenDrawer={onOpenDrawer}
        />
    },
    {// Personal Info | Message column
      title: "Personal Info | Message",
      dataIndex: "personal",
      width: "16%",
      sorter: (a, b) => {
        const str1 = a.name || "";
        const str2 = b.name || "";
        return str1.localeCompare(str2);
      },
      sortDirections: ['descend', 'ascend'],
      ...getColumnSearchProps("mobile"),
      render: (_, rowData) => <ColumnInfoMessage rowData={rowData}/>
    },
    {// Course | Category | Event
      title: "Course|Cat | Event | Src",
      dataIndex: "course",
      width: "16%",
      render: (_, rowData) => <ColumnCourseEvent rowData={rowData}/>,
      filters: categoryOptions.map(category => ({
        text: category.label,
        value: category.value,
      })),
      onFilter: (value, record) => record.category === value
    },
    { // Interest | Stage | PaymentPlan column
      title: "Interest | Stage | Pay Plan",
      dataIndex: "stage",
      width: "16%",
      render: (_, rowData) => <ColumnStagePaymentPlan rowData={rowData}/>,
      filters: leadStages.map(stage => ({
        text: stage.label,
        value: stage.value,
      })),
      onFilter: (value, record) => record.stage === value
    },
    { //  Issues | Reminder column
      title: "Issue | Reminder",
      dataIndex: "reminder",
      width: "16%",
      filters: interestLevels.map(interestLevel => ({
        text: interestLevel.level,
        value: interestLevel.level,
      })),
      onFilter: (value, record) => record.interestLevel === value,
      render: (_, rowData) => <ColumnReminderIssue rowData={rowData}/>
    },
    { // AssignTo | Notes
      title: "AssignTo | Notes",
      dataIndex: "notes",
      width: "16%",
      filters: assignToOptions.map(assignTo => ({
        text: assignTo.label,
        value: assignTo.value,
      })),
      onFilter: (value, record) => record.assignTo === value,
      render: (_, rowData) => <ColumnNote rowData={rowData} />
    },
  ];

  let view;
  if (isLoading) {
    view = <Skeleton />;
  } else if (isError) {
    view = <p>{error?.response?.data?.error?.message || error.message}</p>;
  } else if (!leads?.length) {
    view = " No Lead Found.";
  } else view = (
    <>
      <CSVDownload leads={leads} />
      <Table
        style={{ height: "100%" }}
        size="small"
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={leads}
        pagination={false}
        bordered={true}
      />
      <Pagination
        style={{ float: "right", marginTop: "10px", marginBottom: "10px" }}
        total={apiPagination?.total}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        showQuickJumper
        spageSizeOptions={[25, 50, 75, 100]}
        pageSize={apiPagination?.pageSize}
        current={apiPagination?.page}
        onChange={(page, pageSize) => setPagination({ page, pageSize })}
      />

      {selectedLead && (
        <EditLeadDetailDrawer
          open={open}
          closeDrawer={() => setOpen(false)}
          lead={selectedLead}
        />
      )}
      
    </>
  );

  return (
      <div>{view}</div>
  );
};

export default LeedsTable;