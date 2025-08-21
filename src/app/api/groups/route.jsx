import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getGroupCollection, getDB } from "@/lib/tableHandler";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Group name required" }, { status: 400 });
    }
    const Group_Model = await getGroupCollection(process.env.EMAIL, name);
    const newGroup = await Group_Model.create({title:"Initial Record", expense: 0, paid: false});

    return NextResponse.json({ success: true, group: newGroup });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET(){
  try{
    await connectDB();
    const data = await getDB(process.env.EMAIL);
    const collections = await data.db.listCollections().toArray();
    const groups = collections.map((g) => g.name).filter((name) => name.startsWith("group_"))
    return NextResponse.json({ success: true, groups_data: groups});
  }
  catch(e){
    return NextResponse.json({error: e.message}, {status: 500});
  }
}
