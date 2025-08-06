"use client";
import React, { useState } from "react";
import {
  CopyOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  FormOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import {
  Col,
  Row,
  Space,
  Spin,
  Table,
  Tooltip,
  message,
  Badge,
  Pagination,
} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
// import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";

import settings from "@accounts/_settings";
import { formatDate, formatDateString } from "@accounts/_lib/formatDate";
import InstallmentIdBadgeModal from "./InstallmentIdBadgeModal";
// import SendWAModal from "@accounts/_models/SendWAModal";

const StudentsTable = ({
  students,
  course,
  clickedItem,
  isLoading,
  isError,
  error,
  apiPagination,
  handlePagination,
  pagination,
}) => {
  const [whatsApp, setWhatsApp] = useState({
    openWhatsAppModel: false,
    message: "",
    selectedLead: {},
  });
  // const navigate = useNavigate();
  const navigate = useRouter();

  // Calculate the total amount
  const totalAmount = students?.reduce((sum, item) => {
    const amount = parseFloat(
      item.totalAmount?.replace(/,/g, "").replace(/[^\d.]/g, "")
    );

    if (!isNaN(amount)) {
      return sum + amount;
    } else {
      return sum;
    }
  }, 0);

  // Calculate the total received amount
  const totalReceivedAmount = students?.reduce((total, entry) => {
    if (Array.isArray(entry.feeInstallments)) {
      return (
        total +
        entry.feeInstallments.reduce((entryTotal, installment) => {
          return installment.status === "Received"
            ? entryTotal + installment.amount
            : entryTotal;
        }, 0)
      );
    } else {
      return total;
    }
  }, 0);

  // Calculate the total pending amount
  const totalPendingAmount = students?.reduce((total, entry) => {
    if (Array.isArray(entry.feeInstallments)) {
      return (
        total +
        entry.feeInstallments.reduce((entryTotal, installment) => {
          return installment.status === "Pending"
            ? entryTotal + installment.amount
            : entryTotal;
        }, 0)
      );
    } else {
      return total;
    }
  }, 0);

  const IconStyle = {
    marginRight: "5px",
    transition: "0.3s",
    cursor: "pointer",
  };

  const handleCopyClick = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success("Text copied sucessfully!");
      })
      .catch((error) => {
        message.error("Failed To Text Copied");
      });
  };

  const onPaginationChange = (page, pageSize) => {
    handlePagination({ page, pageSize });
  };

  const handleMobileClick = (record) => {
    let trainingCoursesNames = record.trainingCourses?.length
      ? record.trainingCourses?.map((cat) => {
          // return <span>{cat.name}</span>;
          return cat.nick;
        })
      : null;
    const { id } = record;
    navigate.push(`/fee-detail?id=${id}`);
  };

  const onOpenWAChat = (mobile, message = "") => {
    window.open(settings.waSendLink(mobile, message), "_blank");
  };

  const onOpenCall = (mobile) => {
    window.open(`tel:${mobile}`, "_blank");
  };

  const handleCancelWhatsappModel = () => {
    setWhatsApp({ ...whatsApp, openWhatsAppModel: false });
  };

  const onFinish = ({ mobile, message }) => {
    window.open(settings.waSendLink(mobile, message), "_blank");
    handleCancelWhatsappModel();
  };


  const onMessageTitleChange = (value) => {
    setWhatsApp({ ...whatsApp, message: value });
  };

  const handleShowWhatsappModel = (id) => {
    let selcected = students.find((student) => student.id === id);
    if (selcected)
      setWhatsApp({
        ...whatsApp,
        openWhatsAppModel: true,
        selectedLead: { ...selcected },
      });
  };

  const columns = [
    { // Student ID | updatedAt
      title: "Student ID | updateAt",
      dataIndex: "date",
      render: (date, rowData) => (
          <Tooltip
            placement="right"
            title={<>{rowData.country}</>}
            color="blue"
          >
          <Space.Compact
            direction="vertical"
            size="small"
            align="start"
          >
            <Badge
              style={{ cursor: "pointer" }}
              count={rowData.id}
              overflowCount={999999}
              color="#faad14"
              onClick={() => navigate.push(`/fee-detail?id=${rowData.id}`)}
            />
            {formatDateString(rowData.updatedAt)} <br />
            {rowData.updatedAt}
            <Paragraph style={{ fontSize: "11px", marginTop: "" }}>
              {rowData.city}, {rowData.province}
            </Paragraph>
          </Space.Compact>
          </Tooltip>
      ),
    },
    { // Personal Info | Message
      title: "Personal Info | Message",
      dataIndex: "personal",
      // width: "20%",
      render: (personal, rowData) => (
          <Row>
            <Col span={2}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span onClick={() => handleCopyClick(rowData.mobile)}>
                  <CopyOutlined className="hoverable" style={IconStyle} />
                </span>
                <span>
                  <WhatsAppOutlined
                    className="hoverable"
                    style={IconStyle}
                    onClick={() => onOpenWAChat(rowData.mobile)}
                  />
                </span>
              </div>
            </Col>

            <Col span={16} offset={1} style={{ width: "110px" }}>
              <Tooltip
                placement="right"
                title={
                  <span>
                    {rowData.education}
                    <br />
                    {rowData.email}
                  </span>
                }
                color="blue"
              > 
              <span
                style={{
                  marginTop: "1.9px",
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "2px",
                  marginLeft: "4px",
                  width: "100%",
                }}
              >
                <div>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => handleMobileClick(rowData)}
                  >
                    <b>{rowData.mobile}</b>
                  </span>
                </div>
                <span style={{ fontSize: "11px" }}>{rowData.name}</span>
              </span>
            </Tooltip>
            </Col>

            {/* <Col span={2}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "2px",
                }}
              >
                <span>
                  <a href={`tel:+${rowData.mobile}`}>
                    <PhoneOutlined
                      rotate="90"
                      className="hoverable"
                      style={IconStyle}
                    />
                  </a>
                </span>
                <span>
                  <a href={`sms:+${rowData.mobile}`}>
                    <MessageOutlined
                      className="hoverable"
                      style={IconStyle}
                      onClick={() => onOpenCall(rowData.mobile)}
                    />
                  </a>
                </span>
              </div>
            </Col> */}

            {/* <Col span={2} offset={1}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span>
                  <WhatsAppOutlined
                    className="hoverable"
                    style={IconStyle}
                    onClick={() => handleShowWhatsappModel(rowData.id)}
                  />
                  <SendWAModal
                    openWhatsAppModel={whatsApp.openWhatsAppModel}
                    handleCancelWhatsappModel={handleCancelWhatsappModel}
                    selcectedLead={whatsApp.selectedLead}
                    onFinish={onFinish}
                    onMessageTitleChange={onMessageTitleChange}
                    message={whatsApp.message}
                  />
                </span>
                <span>
                  <a
                    style={{ textDecoration: "none" }}
                    href={"mailto:" + rowData.email}
                  >
                    <MailOutlined className="hoverable" style={IconStyle} />
                  </a>
                </span>
              </div>
            </Col> */}
          </Row>
      ),
    },
    { // Total | Status
      title: "Total | Status",
      dataIndex: "totalAmount",
      render: (totalAmount, rowData) => <>
        <span>{totalAmount}</span>
        <br />
        <span
         style={rowData.completionStatus === "Continue" ? null : {background: "red", color: "white"}}
        >{rowData.completionStatus}</span>
      </>,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    { // Installment ID | Detail
      title: "Installment ID | Detail",
      dataIndex: "feeInstallments",
      // width: "40%",
      render: (feeInstallments, rowData) => {
        const renderFee = feeInstallments?.length
          ? feeInstallments.map((fee) =>
              clickedItem === null || fee.courseId === clickedItem ? (
                <Tooltip key={fee.id} title={fee.note}>
                  <div
                    style={{
                      marginBottom: "8px",
                      color:
                        fee.status === "Received"
                          ? "green"
                          : fee.status === "Pending"
                          ? "orange"
                          : "red",
                    }}
                  >
                    {fee?.isVerified && (
                      <CheckCircleTwoTone
                        twoToneColor={
                          fee.status === "Received"
                            ? "#52c41a"
                            : fee.status === "Pending"
                            ? "orange"
                            : "red"
                        }
                      />
                    )}
                    &nbsp;
                    <InstallmentIdBadgeModal
                      student={rowData}
                      fee={fee}
                      course={course}
                    />
                    &nbsp; Rs. <strong>{fee?.amount.toLocaleString()}</strong>{" "}
                    {" | "} Due: {formatDate(fee.dueDate)}
                    {" | "}
                    <strong>{fee?.status}</strong>{" "}
                    {fee.status === "Received" && (
                      <>
                        {formatDate(fee.paymentDate)} {fee?.paymentMethod}{" "}
                      </>
                    )}
                    {" | "}
                    {fee.couseNick}
                    {fee?.note && <FormOutlined />}
                  </div>
                </Tooltip>
              ) : null
            )
          : null;

        return renderFee;
      },
    },
  ];

  let view;
  if (isLoading) {
    view = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin tip="Loading" size="large" />
      </div>
    );
  } else if (isError) {
    view = <p>{error.message || error?.response?.data?.error?.message}</p>;
  } else if (!students?.length) {
    view = "Select course ... No Student Found";
  } else {
    view = (
      <>
        <Table
          style={{ height: "100%" }}
          size="small"
          columns={columns}
          dataSource={students}
          pagination={false}
          bordered={true}
          footer={() => (
            <strong>
              Total Amount: Rs.{totalAmount.toLocaleString()}{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Received: Rs.
              {totalReceivedAmount.toLocaleString()}{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Pending: Rs.
              {totalPendingAmount.toLocaleString()}{" "}
            </strong>
          )}
        />
        <Pagination
          style={{ float: "right", marginTop: "10px", marginBottom: "10px" }}
          total={apiPagination?.total}
          showTotal={
            (total, range) => `Total: ${total} items`
          }
          pageSize={pagination.pageSize}
          current={pagination.page}
          onChange={onPaginationChange}
          showSizeChanger={false}
        />
      </>
    );
  }

  return (
    <div>
      {view}
    </div>
  );
};
export default StudentsTable;
