import { NextResponse } from "next/server";
export async function GET(){
    const res = NextResponse.json({success: true});
    res.cookies.set("appToken", "", { maxAge : 0, path: "/"});
    res.cookies.set("appToken1", "", { maxAge : 0, path: "/"});
    return res;
}