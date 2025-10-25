"use server"

import { getPayload } from "payload";
import config from "@payload-config";

interface Data {
  email: string
  fullName: string,
  education: string
  phoneNumber: string
  dateOfBirth: string
  gender: "male" | "female"
  homeAddress: string,
  city: string
  state: string
  country: string
}

export const updateStudentData = async (studentId: number, data: Partial<Data>) => {
  try {
    const payload = await getPayload({ config })
    await payload.update({
      collection: "students",
      id: studentId,
      data: {
        fullName: data.fullName,
        education: data.education,
        phoneNumber: data.phoneNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: {
          homeAddress: data.homeAddress,
          city: data.city,
          state: data.state,
          country: data.country,
        }
      },
    })

    return { success: true, message: "Profile updated successfully." };

  } catch (error) {
    console.error("Error updating student data:", error);
    return { success: false, message: "Failed to update your profile. Check your internet connection and try again." };
  }
}