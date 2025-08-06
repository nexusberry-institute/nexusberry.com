export const generateSetPasswordEmailHTML = (params?: { token?: string }) => {
  return `
      <h1>Welcome to NexusBerry!</h1>
      <p>You have been registered with NexusBerry. Click the link below to set your password and complete your registration:</p>
      <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/set-password?token=${params?.token}">Set Your Password</a>
    `;
};
export const generateSetPasswordEmailSubject = () => {
  return "Complete your NexusBerry registration";
};

