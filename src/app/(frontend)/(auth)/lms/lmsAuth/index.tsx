"use client";

import { Student, User } from '@/payload-types';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLoggedInUser, getStudentByUserId } from './lmsAuthFunctions';
import { useRouter } from 'next/navigation'; // Import router for redirection

const LMSAuthContext = createContext<{
  user: User | null;
  student: Student | null;
  isLoading: boolean;
  error: string | null;
  hasCompletedProfile: boolean
  setHasCompletedProfile: (value: boolean) => void
} | undefined>(undefined);

const checkProfileCompleteness = (user: User | null, student: Student | null): boolean => {
  if (!user || !student) return false;

  // Check for required fields in user and student objects
  // Adjust these property names according to your actual data structure
  const hasFullName = !!student.fullName;
  const hasEducation = !!student.education;
  const hasPhone = !!student.phoneNumber;
  const hasGender = !!student.gender;
  const hasCity = !!student.address?.city;

  return hasFullName && hasEducation && hasPhone && hasGender && hasCity;
};

export function LMSAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter(); // Initialize router
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userRes = await getLoggedInUser();

        if (userRes) {
          setUser(userRes);
          const studentRes = await getStudentByUserId(userRes.id, userRes.username, userRes.gmail_username);
          setStudent(studentRes);

          // Check if profile is complete
          const isProfileComplete = checkProfileCompleteness(userRes, studentRes);
          setHasCompletedProfile(isProfileComplete)
          // Redirect if profile is incomplete
          if (!isProfileComplete) {
            router.push(`/lms/profile?tab=personal&toast=${encodeURIComponent("Your Profile is incomplete. Complete Your Profle to Continue")}&toastType=warning`); // Adjust the path as needed
          }
        } else {
          // No user is logged in
          setUser(null);
          setStudent(null);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const value = {
    user,
    student,
    isLoading,
    error,
    hasCompletedProfile,
    setHasCompletedProfile
  };

  return (
    <LMSAuthContext.Provider value={value}>
      {children}
    </LMSAuthContext.Provider>
  );
}

export function useLMSAuth() {
  const context = useContext(LMSAuthContext);
  if (context === undefined) {
    throw new Error('useLMSAuth must be used within an LMSAuthProvider');
  }
  return context;
}
