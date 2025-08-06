"use client"
import React, { useState } from "react";
import { Select, Pagination, Table, message, Spin, Space, Typography } from "antd";
import { useQueryClient } from "react-query";
import dayjs from "dayjs";

// custom components
import UpdateInstallmentNote from "@accounts/_components/Shared/UpdateInstallmentNote";
import ErrorModal from "@accounts/_components/Shared/ErrorModal";
import FeeInfoHeader from "@accounts/_components/Shared/feeInfo/FeeInfoHeader";

// lib, setting, model, enum
import { feeStatus, feeStatusOptions } from "@accounts/_enums/fee-status";
import { paymentMethods } from "@accounts/_enums/paymentMethods";

//api hooks
import usePutInstallmentApi from "@accounts/_hooks/Fee/usePutInstallmentApi";
import useGetFeeStatusApi from "@accounts/_hooks/Fee/useGetFeeStatusApi";

const INIT_FILTERS = {
  status: feeStatus.Received,
  periodStart: null,
  periodEnd: dayjs(),
  course: "all",
  search: {
    type: "",
    value: "",
  },
};

const INIT_PAGINATION = {
  page: 1,
  pageSize: 50,
};

const { Text} = Typography;

const statusPendingColumn = ({rowData}) => {
  
}

const FeeStatusPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showSelectedFilters, setShowSelectedFilters] = useState(false);
  const [loadingMap, setLoadingMap] = useState({});
  const [csvData, setCsvData] = useState([]);
  const [pagination, setPagination] = useState(INIT_PAGINATION);
  const [filters, setFilters] = useState(INIT_FILTERS);

  const { installments, apiPagination, isLoading, isError, error } =
    useGetFeeStatusApi({
      page: pagination.page,
      pageSize: pagination.pageSize,
      filters,
    });

  // console.log("installments", installments);

  const queryClient = useQueryClient();
  const mutation = usePutInstallmentApi();

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handlePagination = ({ page, pageSize }) => {
    setPagination({ page, pageSize });
  };

  const handleDownloadCSV = () => {
    const csvDataArray = installments.feeInstallments.map((record) => ({
      ID: record.id,
      Student: record.student,
      "Training Course": record.trainingCourse,
      Amount: record.amount,
      "Due Date": record.dueDate,
      Status: record.status,
      "Payment Method": record.paymentMethod,
      Note: record.note,
    }));

    // Add the CSV data to the state
    setCsvData(csvDataArray);
  };

  const handleFiltersChange = ({ name, value }) => {
    if (filters[name]) {
      setFilters({ ...filters, [name]: value });
      setPagination(INIT_PAGINATION);
    };
  };

  const handleDateChange = ({
    periodStartName,
    periodStart,
    periodEndName,
    periodEnd,
  }) => {
    setFilters({
      ...filters,
      [periodStartName]: periodStart,
      [periodEndName]: periodEnd,
    });
    setShowSelectedFilters(true);
    setPagination({ page: 1, pageSize: 20 });
  };

  const onPaginationChange = (page, pageSize) => {
    handlePagination({ page, pageSize });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    renderCell: (checked, record, index, originNode) => (
      <div>
        {index + 1}. {originNode}
      </div>
    ),
  };

  const hasSelected = selectedRowKeys.length > 0;

  const onStatusChange = (status, id) => {
    setLoadingMap({ ...loadingMap, [id]: true });
    mutation.mutate(
      { id, data: { status } },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries(["use-get-fee-pending-api"]);
          message.success("Installment Updated sucessfully!");
          setLoadingMap({ ...loadingMap, [id]: false });
        },
        onError: (error) => {
          const msg = error.response?.data?.error?.message || error.message;
          message.error(msg);
          setLoadingMap({ ...loadingMap, [id]: false });
        },
      }
    );
  };

  const columns = [
    {
      title: "Fee ID | Student Name | Mobile",
      dataIndex: "id_name",
      fixed: "left",
    },
    {
      title: "Amount  | Method",
      dataIndex: "amount",
      render: (value, rowData) => <span>{
      `Rs. ${rowData.amount} | ${rowData.paymentMethod}`
      }</span>,
      filters: paymentMethods.map(method => ({
        text: method.label,
        value: method.value,
      })),
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: "Status | Date",
      dataIndex: "status",
      render: (status, rowData) => {
        const loading = loadingMap[rowData.id];
        return (
          <>
            {loading ? (
              <div style={{ justifyContent: "center", alignItems: "center" }}>
                <Spin />
              </div>
            ) : (
              <Space.Compact direction="vertical">
              <Select
                key={rowData.id}
                defaultValue={status}
                onChange={(value) => onStatusChange(value, rowData.id)}
                loading={loading}
                options={feeStatusOptions}
                size="small"
              />
                {rowData.status === feeStatus.Received 
                ? 
                <Text type="success">pay: {rowData.paymentDate}</Text> 
                : 
                <Text type="warning">due: {rowData.dueDate}</Text>
                }
              </Space.Compact>
            )}
          </>
        );
      },
    },
    {
      title: "Training Course",
      dataIndex: "trainingCourse",
    },
    {
      title: "Note",
      dataIndex: "note",
      render: (note, rowData) => {
        return <UpdateInstallmentNote note={note} rowData={rowData} />;
      },
    },
  ];

  return (
    <div>
      <FeeInfoHeader
        title="Fee Status"
        filters={filters}
        handleFiltersChange={handleFiltersChange}
        handleDateChange={handleDateChange}
        hasSelected={hasSelected}
        setPagination={setPagination}
        selectedRowKeys={selectedRowKeys}
        handleDownloadCSV={handleDownloadCSV}
        fileName="fee_pending.csv"
        csvData={csvData}
      />
      <ErrorModal
        error={isError}
        message={error?.response?.data?.error?.message || error?.message}
      />
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={installments?.feeInstallments}
        loading={isLoading}
        pagination={false}
      />
      <Pagination
        style={{
          float: "right",
          marginTop: "10px",
          marginBottom: "10px",
          marginRight: "10px",
        }}
        total={apiPagination?.total}
        showTotal={(total, range) => `Total: ${total} items`}
        pageSize={pagination.pageSize}
        current={pagination.page}
        onChange={onPaginationChange}
        showSizeChanger={true}
        size="small"
        pageSizeOptions={[25, 50, 75, 100, 150, 200, 500]}
      />

      <h2>
        Rs.{" "}
        {installments?.feeInstallments
          ?.reduce((sum, fee) => sum + fee.amount, 0)
          .toLocaleString()}{" "}
      </h2>
    </div>
  );
};
export default FeeStatusPage;
