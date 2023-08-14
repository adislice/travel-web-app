import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "./lib/token";
import { sendErrorResponse } from "./lib/helpers";


let redirectToLogin = false;
export async function middleware(req) {
  let token

  if (req.cookies.has("token")) {
    token = req.cookies.get("token")?.value;
  } else if (req.headers.get("Authorization")?.startsWith("Bearer ")) {
    token = req.headers.get("Authorization")?.substring(7);
  }

  if (req.nextUrl.pathname.startsWith("/login") && (!token || redirectToLogin))
    return;

  if (
    !token &&
    (req.nextUrl.pathname.startsWith("/api/auth"))
  ) {
    return sendErrorResponse(
      401,
      "Error",
      "You are not logged in. Please provide a token to gain access."
    );
  }

  const response = NextResponse.next();

  try {
    if (token) {
      const { sub } = await verifyJWT(token);
      console.log(sub)
      response.headers.set("X-USER-ID", sub);
      req.user = { id: sub };
    }
  } catch (error) {
    redirectToLogin = true;
    if (req.nextUrl.pathname.startsWith("/api")) {
      return sendErrorResponse(401,"Error", "Token is invalid or user doesn't exists");
    }

    return NextResponse.redirect(
      new URL(`/login?${new URLSearchParams({ error: "badauth" })}`, req.url)
    );
  }

  const authUser = req.user;

  if (!authUser) {
    return NextResponse.redirect(
      new URL(
        `/login?${new URLSearchParams({
          error: "badauth",
          forceLogin: "true",
        })}`,
        req.url
      )
    );
  }

  if (req.url.includes("/login") && authUser) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
