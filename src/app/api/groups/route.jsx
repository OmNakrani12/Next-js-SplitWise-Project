import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getGroupCollection, getDB } from "@/lib/tableHandler";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email} = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Information name required" }, { status: 400 });
    }
    const Group_Model_Sender = await getGroupCollection(process.env.EMAIL, name);
    const Group_Model_Receiver = await getGroupCollection(email, name);
    const newGroup_Sender = await Group_Model_Sender.create({title:`Transactions_${email}`, expense: 0, paid: false});
    const newGroup_Receiver = await Group_Model_Receiver.create({title:`Transactions_${process.env.EMAIL}`, expense: 0, paid:false});

    return NextResponse.json({ success: true, group_sender: newGroup_Sender, group_receiver: newGroup_Receiver});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function GET(){
  try{
    await connectDB();
    const data = await getDB(process.env.EMAIL);
    const collections = await data.db.listCollections().toArray();
    const groups = collections.map((g) => g.name).filter((name) => name.startsWith("group_"));

    let group_total = [];
    for (const g of groups) {
      const groupCollection = data.collection(g);
      const docs = await groupCollection.find({}).toArray();

      const total = docs.reduce((sum, i) => {
        return sum + (i.paid ? i.expense : -i.expense);
      }, 0);
      group_total.push(total);
    }

    return NextResponse.json({ success: true, groups_data: {groups, group_total}});
  }
  catch(e){
    return NextResponse.json({error: e.message}, {status: 500});
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Group name and email required" }, { status: 400 });
    }
    const data = await getDB(process.env.EMAIL);
    const collectionName = `group_${name}_${email}`;
    await data.db.dropCollection(collectionName);
    const reverseCollectionName = `group_${name}_${process.env.EMAIL}`;
    try {
      await data.db.dropCollection(reverseCollectionName);
    } catch (dropError) {
      console.log("Reverse collection not found or already dropped");
    }

    return NextResponse.json({ success: true, message: "Group request declined successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

