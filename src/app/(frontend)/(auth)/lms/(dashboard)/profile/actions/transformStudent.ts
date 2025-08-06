import { Student, User } from "@/payload-types"

export const transformStudent = (student: Student, user: User) => {
  return {
    userId: user.id,
    id: student.id,
    fullName: student.fullName || user.username || "Not Provided",
    email: user.email,
    dateOfBirth: student.dateOfBirth && new Date(student.dateOfBirth).toISOString().split('T')[0] || '',
    phoneNumber: student.phoneNumber || '',
    gender: student.gender || undefined as 'male' | 'female' | undefined,
    education: student.education || '',
    homeAddress: student.address?.homeAddress || '',
    city: student.address?.city || '',
    state: student.address?.state || '',
    country: student.address?.country || '',
    picture: typeof student.profilePicture !== "number" ? student.profilePicture?.url ?? '' : '',
    pictureAlt: (typeof student.profilePicture !== "number" ? student.profilePicture?.alt ?? '' : '') || "Student Profile Picture",
    joinDate: student.createdAt,
  };
}