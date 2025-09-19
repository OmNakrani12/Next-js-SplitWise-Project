import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
    const token = req.cookies.get("appToken")?.value || req.cookies.get("appToken1")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
        const {payload} = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        if(req.nextUrl.pathname.startsWith("/api/users") && req.method === "GET"){
            if(payload.email !== "om51ppsv20231@gmail.com"){
                return NextResponse.json({
                    error: "Access denied it is for admin only!"
                },{
                    status:403
                });
            }
        }
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}
export const config = {
    matcher: ["/profile/:path*", "/groups/:path*", "/api/users:path*"],
};
