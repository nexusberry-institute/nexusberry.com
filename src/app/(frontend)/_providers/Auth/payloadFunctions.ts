"use server"

import { getPayload } from "payload"
import config from "@/payload.config"
import { cookies, headers } from "next/headers";
import { Users } from "@/collections/Users";
import { getDefaultRedirect } from "@/utilities/getDefaultRedirect";

interface Login {
  email: string;
  password: string;
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
        email: true,
        provider: true,
      }
    })

    if (!docs.length) {
      return { success: false, message: "We couldn't find an account with this email. Please check your email address or create a new account." }
    }

    // Check provider BEFORE attempting login to avoid password mismatch on Google accounts
    if (docs[0]?.provider === "google") {
      return {
        success: false,
        message: "Your account is registered through Google. Use Login with Google to access this account."
      }
    }

    const result = await payload.login({
      collection: 'users',
      data: {
        email: args.email,
        password: args.password
      }
    })

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
        success: true,
        message: "Welcome back! You've successfully logged in.",
        user: result.user,
        redirectTo: getDefaultRedirect(result.user.roles as string[]),
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
