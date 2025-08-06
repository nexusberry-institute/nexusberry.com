"use client"
import { useState } from "react";
import ActiveCourses from "@accounts/_components/Attendence/ActiveCourses";

const TeacherDashboard = () => {
  const [clickedItem, setClickedItem] = useState(null);
  const [filters, setFilters] = useState({
    course: "all",
    search: {
      type: "",
      value: "",
    },
  });

  const handleFiltersChange = ({ name, value }) => {
    if (filters[name]) {
      setFilters({ ...filters, [name]: value });
    } else {
      setFilters({
        ...filters,
        course: "all",
      });
    }
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>All Training Batches</h1>
      <p
        style={{
          textAlign: "center",
          marginTop: "-15px",
        }}
      >
        Select Any Course To Mark Attendence
      </p>

      <div
        style={{
          marginBottom: "none",
          padding: "10px",
        }}
      >
        <ActiveCourses
          handleFiltersChange={handleFiltersChange}
          clickedItem={clickedItem}
          setClickedItem={setClickedItem}
          filters={filters}
        />
      </div>
    </>
  );
};

export default TeacherDashboard;
