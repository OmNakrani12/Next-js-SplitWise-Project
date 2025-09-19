import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getGroupCollection, getDB } from "@/lib/tableHandler";
export async function GET(){
    try{
        await connectDB();
        const connection = await getDB(process.env.EMAIL);
        const db = connection.db;
        const collections = await db.listCollections().toArray();
        const groups = collections.map((g) => g.name).filter((name) => name.startsWith("group_"));
        let expenses = [];
        for(const g of groups){
            const groupCollection = db.collection(g);
            const docs = await groupCollection.find({}).toArray();
            for(const e of docs){
                const date = new Date(e.date);
                const dd = (date.getDate() < 10 ? "0" : "") + date.getDate();
                const mm = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1);
                const yyyy = (date.getFullYear());
                const type = e.paid ? "paid" : "borrowed";
                expenses.push({amount: e.expense, date: `${yyyy}-${mm}-${dd}`, type: type});
            }
        }
        return NextResponse.json({success: true, allExpenses: expenses});
    }
    catch(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}