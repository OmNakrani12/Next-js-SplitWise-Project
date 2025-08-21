import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Users } from "@/lib/models/model_user";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
    try {
        await connectDB();
        const data = await Users.find({});
        console.log("Users data:", data);
        return NextResponse.json({
            result: true,
            data: data,
            count: data.length
        });
    } catch (error) {
        console.error("Error in users API:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error.message },
            { status: 500 }
        );
    }
}