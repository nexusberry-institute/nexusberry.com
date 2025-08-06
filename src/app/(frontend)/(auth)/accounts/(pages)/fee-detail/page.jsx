"use client";

import React from "react";
import { Suspense } from 'react'
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation'

import FeeInstallmentComponent from "@accounts/_components/feeInstallment/FeeInstallmentComponent";
import SearchStudentById from "@accounts/_components/feeInstallment/SearchStudentById";
import useGetStudentApi from "@accounts/_hooks/Student/useGetStudentApi";


function FeeDetail(){
  // let [searchParams, setSearchParams] = useSearchParams();
   let searchParams = useSearchParams();
   const router = useRouter()
  const id = searchParams.get("id");
  // const onChangeSearchId = (id) => setSearchParams({ id });
  const onChangeSearchId = (id) => {
    router.push(`?id=${id}`)
  }
  const { student, isLoading, isError, error } = useGetStudentApi(id);
  // console.log("student: ", student);

  const [selectedCourseId, setSelectedCourseId] = React.useState(null);
  const onChangeCourse = courseId => setSelectedCourseId(courseId);

  return (
    <div style={{marginLeft: "16px"}}>
      <p
        style={{
          fontWeight: "bold",
          fontSize: "30px",
          fontFamily: "Roboto",
          marginBottom: "15px",
        }}
      >
        Record Fee Installment
      </p>
      
      <SearchStudentById
        id={id}
        student={student}
        isLoading={isLoading}
        onChangeSearchId={onChangeSearchId}
        onChangeCourse={onChangeCourse}
      />

      
      {!id ? <div /> : (id && !isLoading && !isError) ? (
        <FeeInstallmentComponent 
          student={student} 
          selectedCourseId={selectedCourseId}
         />
      ) : (
        <>
          {/* <h3 style={{ color: "red" }}>Error in loading student id = {id}</h3>
          <h4 style={{ color: "red" }}>Error Detail: </h4>
          <p>{JSON.stringify(error)}</p> */}
          <h3 style={{color: "red"}}>No data found against id {id}</h3>
        </>
      )}
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeeDetail />
    </Suspense>
  )
}

