import { DownloadOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import React from "react";
import { CSVLink } from "react-csv";

const CSVDownload = ({ leads }) => {

  const csvData = leads.map((record) => ({
    name: record.name || "",
    mobile: record.mobile || "",
    email: record.email || "",
    course: record.course || "",
    source: record.source || ""
  }));

  return (
    <div>
      <CSVLink
        data={csvData}
        filename={`leads-exported-${new Date().toLocaleDateString()}.csv`}
        className="ant-btn ant-btn-primary"
        target="_blank"
        style={{ textDecoration: "none" }}
      >
        <FloatButton icon={<DownloadOutlined />} />
      </CSVLink>
    </div>
  );
};

export default CSVDownload;