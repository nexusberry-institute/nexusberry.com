export default function Dashboard(){
  return(
    <div>
      <h1>Dashboard</h1>
      <p>Dashboard is commented out due to some build time issues. </p>
    </div>
  )
}

//due to error on build time Dashboard is commented

// "use client"
// import React, { useState } from "react";
// import useGetDashboardLeadApi from "@cms/_hooks/Dashboard/useGetDashboardLeadApi";
// import DashboardFilters from "@cms/_components/Dashboard/DashboardFilters";
// import DashboardTable from "@cms/_components/Dashboard/DashboardTable";

// const Dashboard = () => {
//   const today = new Date();
//   const [filters, setFilters] = useState({
//     periodStart: today.toISOString().split("T")[0],
//     periodEnd: today.toISOString().split("T")[0],
//     category: "all",
//     course: "all",
//   });

//   console.log("showSelectedFilters", filters)
//   const [,setShowSelectedFilters] = useState(false);

//   const [pagination] = useState({
//     page: 1,
//     pageSize: 31,
//   });

//   const { leads, leadsCount, isLoading, isError, error } =
//     useGetDashboardLeadApi({
//       page: pagination.page,
//       pageSize: pagination.pageSize,
//       filters,
//     });

//   const startDate = new Date(filters.periodStart);
//   const endDate = new Date(filters.periodEnd);
//   const currentDate = new Date(startDate);
//   const leadsByDate = []; // Array to store grouped leads

//   while (currentDate <= endDate) {
//     const currentDateFormat = currentDate.toISOString().split("T")[0];
//     const leadsForCurrentDate = []; // Array to store leads for current date
//     leads?.forEach((lead) => {
//       const createadAtDateFormat = lead.createdAt.split("T")[0];
//       if (currentDateFormat === createadAtDateFormat) {
//         leadsForCurrentDate.push(lead);
//       }
//     });

//     if (leadsForCurrentDate.length > 0) {
//       // Store leads for current date in an object
//       const leadsObj = {
//         date: currentDateFormat,
//         leads: leadsForCurrentDate,
//       };
//       leadsByDate.push(leadsObj);
//     }

//     currentDate.setDate(currentDate.getDate() + 1);
//   }
//   console.log("Leads grouped by date:", leadsByDate);
//   //now we will find out stagewise leads count
//   // Your initial stageWiseLeads object
//   let stageWiseLeadsCount = {
//     ONE_FOLLOW_UP: 0,
//     ONE_FOLLOW_UP_NOT_RESPONDING: 0,
//     TWO_INTERESTED_LOW: 0,
//     TWO_INTERESTED_MEDIUM: 0,
//     TWO_INTERESTED_HIGH: 0,
//     THREE_ATTENDED_DEMO: 0,
//     FOUR_CONFIRMED_PAYING: 0,
//     FIVE_ADMITTED: 0,
//     NO_FOLLOWUP_REFUSED: 0,
//     NO_FOLLOWUP_WASTE: 0,
//   };

//   // Your leadsByDate array of objects
//   // An array to store the results for each object
//   let leadsByStageCount = [];

//   // Iterate through the leadsByDate array
//   for (const obj of leadsByDate) {
//     let stageCounts = { ...stageWiseLeadsCount };

//     for (const lead of obj.leads) {
//       stageCounts[lead.stage]++;
//     }
//     leadsByStageCount.push({ date: obj.date, stageCounts });
//   }

//   console.log("stageWiseLeadsCount", leadsByStageCount);

//   const handleFiltersChange = ({ name, value }) => {
//     console.log({ name, value });
//     if (filters[name]) {
//       setFilters({ ...filters, [name]: value });
//       setShowSelectedFilters(true);
//     } else {
//       setFilters({
//         ...filters,
//         category: "all",
//         course: "all",
//       });
//       setShowSelectedFilters(false);
//     }
//   };

//   const handleDateChange = ({
//     periodStartName,
//     periodStart,
//     periodEndName,
//     periodEnd,
//   }) => {
//     // console.log("handle");
//     // console.log("period start", periodStart);
//     // console.log("period End", periodEnd);
//     if (!periodStart) {
//       setFilters({
//         ...filters,
//         periodStart:today.toISOString().split("T")[0],
//         periodEnd:today.toISOString().split("T")[0],
//       });
//     }
//     else{
//       setFilters({
//         ...filters,
//         [periodStartName]: periodStart,
//         [periodEndName]: periodEnd,
//       });
//     }
//     setShowSelectedFilters(true);
//   };

//   // const handlePagination = ({ page, pageSize }) => {
//   //   setPagination({ page, pageSize });
//   // };

//   return (
//     <>
//       <DashboardFilters
//         filters={filters}
//         handleFiltersChange={handleFiltersChange}
//         handleDateChange={handleDateChange}
//         leadsCount={leadsCount}
//         leads={leads}
//       />
//       <DashboardTable
//         leadsByDate={leadsByDate}
//         leadsByStageCount={leadsByStageCount}
//         isLoading={isLoading}
//         isError={isError}
//         error={error}
//       />
//       {/* <StudentvsLeadChart/> */}
//     </>
//   );
// };

// export default Dashboard;
