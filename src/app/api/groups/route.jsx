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
    const newGroup_Sender = await Group_Model_Sender.create({title:"Initial Record", expense: 0, paid: false});
    const newGroup_Receiver = await Group_Model_Receiver.create({title:"Initial Record", expense: 0, paid:false});

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
    const groups = collections.map((g) => g.name).filter((name) => name.startsWith("group_"))
    return NextResponse.json({ success: true, groups_data: groups});
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

    // Get the database instance
    const data = await getDB(process.env.EMAIL);
    
    // Drop the collection for the specific group and email combination
    const collectionName = `group_${name}_${email}`;
    await data.db.dropCollection(collectionName);
    
    // Also try to drop the reverse collection if it exists
    const reverseCollectionName = `group_${name}_${process.env.EMAIL}`;
    try {
      await data.db.dropCollection(reverseCollectionName);
    } catch (dropError) {
      // Collection might not exist, which is fine
      console.log("Reverse collection not found or already dropped");
    }

    return NextResponse.json({ success: true, message: "Group request declined successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Check if your email exists in someone else's notifications
export async function PATCH(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { yourEmail, targetEmail } = body;

    if (!yourEmail || !targetEmail) {
      return NextResponse.json({ error: "Both emails are required" }, { status: 400 });
    }

    // Get the target user's database
    const targetDB = await getDB(targetEmail);
    
    // Check if notifications collection exists and find your email
    const notificationsCollection = await getGroupCollection(targetEmail, "", true);
    
    // Find notification with your email
    const notification = await notificationsCollection.findOne({ email: yourEmail });
    
    if (notification) {
      return NextResponse.json({ 
        success: true, 
        exists: true, 
        notification: {
          name: notification.name,
          email: notification.email
        }
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        exists: false, 
        message: "No notification found for this email" 
      });
    }

  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
