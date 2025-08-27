import { connectDB } from "@/lib/mongodb";
import { getDB } from "@/lib/tableHandler";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(request, context) {
    try {
        await connectDB();
        const { id } = await context.params;
        if (!id) {
            return NextResponse.json(
                { success: false, message: "Notification ID is required" },
                { status: 400 }
            );
        }

        const db = await getDB(process.env.EMAIL);
        const collection = db.collection("notifications");
        const existingNotification = await collection.findOne({ _id: new ObjectId(id) });
        if (!existingNotification) {
            return NextResponse.json(
                { success: false, message: "Notification not found" },
                { status: 404 }
            );
        }

        // Delete the notification
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Notification deleted successfully",
                    deletedId: id
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Failed to delete notification" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error deleting notification:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
                error: error.message
            },
            { status: 500 }
        );
    }
}

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = params;
        if (!id) {
            return NextResponse.json(
                { success: false, message: "Notification ID is required" },
                { status: 400 }
            );
        }

        const db = await getDB(process.env.EMAIL);
        const collection = db.collection("notifications");
        const notification = await collection.findOne({ _id: new ObjectId(id) });
        if (!notification) {
            return NextResponse.json(
                { success: false, message: "Notification not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            notification: notification
        });
    } catch (error) {
        console.error("Error fetching notification:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
                error: error.message
            },
            { status: 500 }
        );
    }
}
