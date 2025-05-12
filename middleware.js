import { NextResponse } from "next/server";

export function middleware(request) {
  const uid = request.nextUrl?.search || false;
  if ((uid && uid.includes("width")) || uid.includes("data")) {
    return NextResponse.next();
  } else {
    const main = new URL("/", request.url);
    return NextResponse.redirect(main);
  }
}

export const config = {
  matcher: ["/configurator"],
};
