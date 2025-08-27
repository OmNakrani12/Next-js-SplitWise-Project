import { connectDB } from "@/lib/mongodb";
import { getGroupCollection } from "@/lib/tableHandler";
import { NextResponse } from "next/server";

export async function GET(req,{params}){
    try{
        await connectDB();
        const {groupName} = await params;
        console.log(process.env.EMAIL);
        const collection = await getGroupCollection(process.env.EMAIL, groupName, false);
        const data = await collection.find({title : { $not : /^Transactions_/ }}).exec();
        return NextResponse.json({success : true, content: data}, {status: 200});
    }
    catch(e){
        return NextResponse.json({ error : e.message},{status : 500});
    }
}
export async function POST(req, {params}){
    try{
        await connectDB();
        const {groupName} = await params;
        const {amount, category, paid} = await req.json();
        const collection = await getGroupCollection(process.env.EMAIL, groupName, false);
        const find_Transaction = await collection.findOne({title : {$regex : /^Transactions_/}});
        let ReceiverEmail;
        if (find_Transaction) {
            ReceiverEmail = find_Transaction.title.replace(/^Transactions_/, "");
            console.log("Receiver Email:", ReceiverEmail);
            const ReceiverCollection = await getGroupCollection(ReceiverEmail, groupName, false);
            const ReceiverData = await ReceiverCollection.create({expense: amount, title: category, date: new Date().toISOString(), paid: !paid});
        }
        const data = await collection.create({expense: amount, title: category, date: new Date().toISOString(), paid});
        return NextResponse.json({success : true, content: data, email: ReceiverEmail}, {status: 200});
    }
    catch(e){
        return NextResponse.json({error: e.message}, {status : 500});
    }
}