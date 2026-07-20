import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "shoplab_session";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function proxy(request) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    try {
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/", request.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/carrello/:path*", "/prodotto/:path*"],
};
