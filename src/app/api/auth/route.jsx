import { NextResponse } from "next/server";
import { Users } from "@/lib/models/model_user";
import { connectDB } from '@/lib/mongodb';
import { getGroupCollection } from "@/lib/tableHandler";

export async function POST(request){
    try{
        await connectDB();
        const body = await request.json();
        const {email, url} = body;
        if(!email || !url){
            return NextResponse.json({error: "Authorization failed"}, {status: 400});
        }
        const isExist = await Users.findOne({email});
        if(!isExist){
            await Users.create({email, url});
        }
        process.env.EMAIL = email;
        process.env.URL = url;
        const recordModel = await getGroupCollection(email, "JayShreeRam");
        return NextResponse.json({email, url});
    }
    catch(e){
        console.log("Error:" + e.message);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}