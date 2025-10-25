"use client"
import React, { useCallback,  useState } from "react";
//custom
import LeadHeader from "@cms/_components/Leads/LeadHeader";
import LeadTableFilters from "@cms/_components/Leads/LeadTableFilters";
import LeedsTable from "@cms/_components/Leads/LeedsTable";
// import ScrollToTop from "@cms/_components/Shared/ScrollToTop";

const LeadsPage = () => {
  const [filters, setFilters] = useState({});
  const [showSelectedFilters, setShowSelectedFilters] = useState(false);

  const handleFiltersChange = useCallback(({ name, value }) => {
    setFilters({ ...filters, [name]: value });
  },[filters]);

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
  };

  return (
    <div style={{ padding: "15px" }}>
      <LeadHeader
        handleFiltersChange={handleFiltersChange}
        selectedRows={[]}/>
      
      <br />

      <LeadTableFilters
        filters={filters}
        showSelectedFilters={showSelectedFilters}
        handleFiltersChange={handleFiltersChange}
        handleDateChange={handleDateChange}
        leadsCount={0}
        leads={[]}
      />
      
      <LeedsTable filters={filters}/>
      {/* <ScrollToTop /> */}
    </div>
  );
};

export default LeadsPage;
