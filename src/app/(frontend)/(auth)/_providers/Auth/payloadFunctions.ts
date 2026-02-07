"use server"

import { getPayload } from "payload"
import config from "@/payload.config"
import { cookies, headers } from "next/headers";
import { Users } from "@/collections/Users";

interface Login {
  email: string;
  password: string;
}

interface Create {
  email: string
  firstName: string
  lastName: string
  password: string
}

export const createAccount = async (args: Create) => {
  try {
    const payload = await getPayload({ config })
    const existingUser = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: args.email
        }
      },
      pagination: false,
      depth: 0,
      limit: 1,
      select: {
        email: true,
      }
    })

    if (existingUser.docs.length) {
      return {
        success: false,
        message: "Duplicate email Error. User with this email already exist. Please sign in or use a different email.",
        user: null,
      }
    }

    const createdUser = await payload.create({
      collection: 'users',
      data: {
        username: args.email,
        email: args.email,
        password: args.password
      }
    })

    return {
      success: true,
      message: "Account created successfully",
      user: createdUser
    }

  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create account. Check your internet connection and try again.",
      user: null,
    }
  }
}

export const payloadLogin = async (args: Login) => {
  try {

    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: "users",
      where: {
        email: { equals: args.email }
      },
      limit: 1,
      depth: 0,
      select: {
        email: true
      }
    })

    if (!docs.length) {
      return { success: false, message: "We couldn't find an account with this email. Please check your email address or create a new account." }
    }

    const result = await payload.login({
      collection: 'users',
      data: {
        email: args.email,
        password: args.password
      }
    })

    if (result.user?.provider === "google") {
      return {
        success: false,
        message: "Your account is registered through google. Use Login with google to access this account"
      }
    }

    if (!result.user?._verified) {
      return {
        success: false,
        message: "our account needs verification. Please check your email for a verification link."
      }
    }

    if (result.user?.blocked) {
      return {
        success: false,
        message: "Your account has been temporarily suspended. Please contact our support team for assistance."
      }
    }

    if (result.token) {
      const storeCookie = await cookies();
      storeCookie.set("payload-token", result.token, {
        httpOnly: true,
        maxAge: typeof Users.auth === "object" ? Users.auth.tokenExpiration : 7200,  //set the max age of token as in users collection. default is 7200s (2 hours)
        path: "/",
        secure: true,
      })

      return {
        success: true, message: "Welcome back! You've successfully logged in.", user: result.user
      }
    } else {
      return { success: false, message: "The password you entered is incorrect. Please try again. " }
    }

  }
  catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "We couldn't complete your login request. Please check your connection and try again."
    }
  }
}

export const payloadLogout = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("payload-token"); // Deletes the HTTP-only cookie

    return { success: true }; // Indicate success
  } catch (error) {
    return { success: false, message: "An error occurred during logout" };
  }
}

export const payloadForgetPassword = async (email: string) => {
  try {
    const payload = await getPayload({ config })
    const token = await payload.forgotPassword({
      collection: 'users',
      data: {
        email
      }
    })
    return {
      success: true,
      message: "Password reset link has been sent to your email",
      error: ""
    }
  } catch (error) {
    return {
      success: false,
      message: "",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }
}

export const payloadResetPassword = async (password: string, token: string) => {
  try {
    const payload = await getPayload({ config })
    const result = await payload.resetPassword({
      collection: 'users',
      data: {
        password,
        token
      },
      overrideAccess: true
    })

    if (result.token) {
      const storeCookie = await cookies();
      storeCookie.set("payload-token", result.token, {
        httpOnly: true,
        path: "/",
        secure: true,
      })

      return { success: true, message: "Your password has been successfully updated. You can now log in with your new password." }
    } else {
      return { success: false, message: "Unable to update password. Please try again or contact support." }
    }

  } catch (error) {
    return {
      success: false,
      message: "Your password reset link has expired or is invalid. Please request a new reset link.",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }
  }

}

export const getUser = async () => {
  try {
    const getHeaders = await headers()
    const payload = await getPayload({ config })
    const { user, permissions } = await payload.auth({ headers: getHeaders })

    return { user, permissions }
  } catch (error) {
    console.error(error)
    return { user: null, permissions: null }
  }
}