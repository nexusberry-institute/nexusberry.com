"use client";

import React from "react";
import Header from "../../components/Header";
import StudentProfile from "./components/StudentProfile";
import { transformStudent } from "./actions/transformStudent";
import { useLMSAuth } from "../../lmsAuth";
import AuthLoading from "../../components/AuthLoading";
import AuthError from "../../components/AuthError";
import NotAuthorized from "../../components/NotAuthorized";

const UserProfilePage = () => {
  const { user, student: rawStudent, isLoading, error } = useLMSAuth();
  // Loading state with a spinner
  if (isLoading) return <AuthLoading />

  // Error state with descriptive message and action
  if (error) return <AuthError desc={error} />

  // Unauthorized state with helpful message and login option
  if (!user || !rawStudent) return <NotAuthorized />

  // Safe transformation with error handling
  try {
    const student = transformStudent(rawStudent, user);

    return (
      <>
        <Header title="Student Profile" subtitle="View and update your profile" />
        <StudentProfile student={student} />
      </>
    );
  } catch (transformError) {
    console.error("Error transforming student data:", transformError);

    return <AuthError desc="Error transforming student data. Please try again later." />;
  }
};

export default UserProfilePage;
