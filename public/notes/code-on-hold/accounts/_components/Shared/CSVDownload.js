"use client"
import { Button } from "antd";
import React, { useState } from "react";
import { CSVLink } from "react-csv";

const CSVDownload = ({ handleDownloadCSV, csvData, fileName }) => {
  const DownloadButton = (
    <Button
      onClick={handleDownloadCSV}
      type="primary"
      style={{ marginTop: "15px" }}
    >
      Download CSV
    </Button>
  );

  return (
    <div>
      <CSVLink
        data={csvData}
        filename={fileName}
        className="ant-btn ant-btn-primary"
        target="_blank"
        style={{ textDecoration: "none" }}
      >
        {DownloadButton}
      </CSVLink>
    </div>
  );
};

export default CSVDownload;
