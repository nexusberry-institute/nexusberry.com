"use server"

import { getPayload } from "payload";
import config from "@payload-config";

export const createUser = async (data: { name: string, email: string; password: string }) => {
  try {

    const payload = await getPayload({ config });
    const user = await payload.create({
      collection: "users",
      data: {
        // username: data.name,
        email: data.email,
        password: data.password,
        roles: ["student"],
      },
    });

    return {
      success: true,
      message: "We have sent a confirmation email. Please check your inbox and click the confirmation link to activate your account.",
      result: user,
    }

  } catch (error) {
    console.error("Error creating User", error)
    return {
      success: false,
      message: "Error while creating your account. Check your internet connection and try again.",
      result: null
    }
  }
}

export const checkUser = async (email: string) => {
  try {
    const payload = await getPayload({ config });
    const user = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (user.docs[0]) {
      return {
        success: true,
        message: "Account already exists. Try logging in or registering with a different email.",
        result: user.docs[0],
      }
    }

    return {
      success: false,
      message: "Account does not exist. Please register to continue.",
      result: undefined
    }

  } catch (error) {
    console.error("Error checking User", error)
    return {
      success: false,
      message: "Error while checking your account. Check your internet connection and try again.",
      result: undefined
    }
  }
}