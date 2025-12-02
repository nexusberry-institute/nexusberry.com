import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, loginWith } from './serverActions';

// app/oauth/callback/google/route.ts
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(
      new URL(
        `/login?toast=${encodeURIComponent("We couldn't complete your sign-in. Please try again")}&toastType=error`,
        process.env.NEXT_PUBLIC_SERVER_URL!
      )
    );
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/oauth/callback/google`,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(
        new URL(
          `/login?toast=${encodeURIComponent("Google sign-in was interrupted. Please try again.")}&toastType=error`,
          process.env.NEXT_PUBLIC_SERVER_URL!
        )
      );
    }

    const tokenData = await tokenRes.json();

    const { access_token, id_token } = tokenData;
    if (!access_token) {
      return NextResponse.redirect(
        new URL(
          `/login?toast=${encodeURIComponent("Unable to verify your Google account. Please try again.")}&toastType=error`,
          process.env.NEXT_PUBLIC_SERVER_URL!
        )
      );
    }

    // Get user info from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const googleUser = await userRes.json();


    if (!googleUser || !googleUser.email) {
      return NextResponse.redirect(
        new URL(
          `/login?toast=${encodeURIComponent("We couldn't access your email from Google. Please try another sign-in method.")}&toastType=error`,
          process.env.NEXT_PUBLIC_SERVER_URL!
        )
      );
    }

    try {
      const user = await getUserByEmail(googleUser)
      await loginWith(user)
    } catch (error) {
      return NextResponse.redirect(
        new URL(
          `/login?toast=${encodeURIComponent("We had trouble signing you in. Please try again or contact support.")}&toastType=error`,
          process.env.NEXT_PUBLIC_SERVER_URL
        ),
      )
    }

    return NextResponse.redirect(
      new URL(
        `/lms?toast=${encodeURIComponent("Successfully logged In")}&toastType=success`,
        process.env.NEXT_PUBLIC_SERVER_URL
      )
    )
  } catch (error) {
    return NextResponse.redirect(
      new URL(`/login?toast=${encodeURIComponent("toast=Something went wrong with your sign-in. Please try again later.")}&toastType=error`, process.env.NEXT_PUBLIC_SERVER_URL!)
    );
  }
}
