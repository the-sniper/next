import { NextResponse } from "next/server";

export function middleware(req) {
  const fileExtensions =
    /\.(css|js|png|jpg|jpeg|gif|webp|avif|mp4|svg|woff|woff2|ttf|eot)$/;

  if (req.nextUrl.pathname.match(fileExtensions)) {
    const oneYearInSeconds = 60 * 60 * 24 * 365;
    const cacheControl = `public, max-age=${oneYearInSeconds}, immutable`;
    return NextResponse.rewrite(req).withHeader("Cache-Control", cacheControl);
  }
}
