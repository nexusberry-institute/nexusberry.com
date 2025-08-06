import React from 'react';
import ResetPasswordForm from '../_components/ResetForm/page';

interface SetPasswordPageProps {
  searchParams: any
}

const SetPasswordPage: React.FC<SetPasswordPageProps> = ({ searchParams }) => {
  const { token, action } = searchParams;
  const isInitialSet = action === 'verify';

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Invalid or Missing Token</h1>
          <p>Please request a new password reset link or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full">
        <ResetPasswordForm token={token} isInitialSet={isInitialSet} />
      </div>
    </div>
  );
};

export default SetPasswordPage;

