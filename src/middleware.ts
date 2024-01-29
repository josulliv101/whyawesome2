import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const primaryTag = request.cookies.get("primary-tag");
  if (false && primaryTag?.value === "place") {
    return NextResponse.redirect("http://localhost:3000/all/place");
  } else if (primaryTag?.value) {
    return NextResponse.rewrite(
      "http://localhost:3000/all/" + primaryTag?.value
    );
  }
  return NextResponse.next();
}

/*
export function middleware(request: NextRequest) {
  // Assume a "Cookie:nextjs=fast" header to be present on the incoming request
  // Getting cookies from the request using the `RequestCookies` API

  // const capturingRegex = /(?<animal>place|person)/gi;
  //const found = paragraph.match(capturingRegex);

  // if (request.nextUrl.pathname.match(capturingRegex)) {
  //   return NextResponse.rewrite(new URL("/chicago/person", request.url));
  // }

  const isPathPlace = request.nextUrl.pathname.includes("/place");
  const isPathPerson = request.nextUrl.pathname.includes("/person");
  const primaryTag = request.cookies.get("primary-tag");

  console.log("primary-tag", primaryTag);
  console.log("middlewar", request.nextUrl.pathname);

  const response = NextResponse.next();

  if (!request.cookies.has("primary-tag")) {
    let primaryTag = "person";
    if (isPathPlace) {
      primaryTag = "place";
    }
    // response.cookies.set("primary-tag", primaryTag);
    response.cookies.set({
      name: "primary-tag",
      value: primaryTag,
      path: "/",
    });
  } else if (isPathPlace) {
    response.cookies.set({
      name: "primary-tag",
      value: "place",
      path: "/",
    });
  } else if (isPathPerson) {
    response.cookies.set({
      name: "primary-tag",
      value: "person",
      path: "/",
    });
  }
  return response;
}
*/
export const config = {
  matcher: [
    "/",
    // "/:hub(boston|chicago|new-york-city|all)",
    // "/:hub/(person|place)/:tags*",
  ],
};
// See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     {
//       source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
//       missing: [
//         { type: "header", key: "next-router-prefetch" },
//         { type: "header", key: "purpose", value: "prefetch" },
//       ],
//     },
//   ],
// };
