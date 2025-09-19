import { NextResponse } from "next/server";
import { Users } from "@/lib/models/model_user";
import { connectDB } from '@/lib/mongodb';
import { getGroupCollection } from "@/lib/tableHandler";
import jwt from "jsonwebtoken";

export async function POST(request){
    try{
        await connectDB();
        const body = await request.json();
        const {email, url} = body;
        if(!email || !url){
            return NextResponse.json({error: "Authorization failed"}, {status: 400});
        }
        let user = await Users.findOne({email});
        if(!user){
            user = await Users.create({email, url, provider:"google-login"});
        }
        const appToken = jwt.sign(
            { id: user._id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        const res = NextResponse.json({ message: "Login successful" });
        res.cookies.set("appToken1", appToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600,
            path: "/",
        });
        process.env.EMAIL = email;
        process.env.URL = url;
        const recordModel = await getGroupCollection(email, "notifications", false);
        return res;
    }
    catch(e){
        console.log("Error:" + e.message);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}