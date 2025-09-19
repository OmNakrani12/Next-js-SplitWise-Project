import { connectDB } from "@/lib/mongodb";
import { getDB } from "@/lib/tableHandler";
import { NextResponse } from "next/server";
import { getGroupCollection } from "@/lib/tableHandler";

export async function POST(request){
    try{
        await connectDB();
        const {name, email} = await request.json();
        const db = await getDB(email);
        if(!name || !email){
            alert("Enter name or email something is being missed!");
        }
        const notifyModel = await getGroupCollection(email, "notifications", true);
        const newNotification = await notifyModel.create({name: name, email: process.env.EMAIL});
        return NextResponse.json({success: true, content: newNotification});
    }
    catch(e){
        return NextResponse.json({error: e.message},{status: 500});
    }
}
export async function GET(){
    try{
        await connectDB();
        const email = process.env.EMAIL;
        const data = await getDB(email);
        const notifications = await data.db.collection("notifications").find({}).toArray();
        return NextResponse.json({ success: true, notifications: notifications, length: notifications.length});
    }
    catch(e){
        return NextResponse.json({ message: e.message},{status: 500});
    }
}
export async function DELETE(req, {params}){
    try{
        await connectDB();
        const { id } = params.id;
        if (!id) {
            return NextResponse.json({ success: false, message: "ID missing" }, { status: 400 });
        }
        console.log("Email is retrived : " + process.env.EMAIL);
        const model = await getGroupCollection(process.env.EMAIL, "notifications", true);
        const deleted = await model.findByIdAndDelete(id);
        console.log("Id is retrived : " + id);
        if(!deleted) {
            return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
        }
        return NextResponse.json({success : true, message: "Deleted Successfully"});
    }
    catch(e){
        return NextResponse.json({error: e.message}, {status:500});
    }
}