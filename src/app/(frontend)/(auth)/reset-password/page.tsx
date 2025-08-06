import React from 'react';
import ResetPasswordForm from './ResetPasswordForm';

interface ResetPasswordPageProps {
  searchParams: any
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ searchParams }) => {
  const token = searchParams.token as string;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Invalid or Missing Token</h1>
          <p>Please request a new password reset link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;

