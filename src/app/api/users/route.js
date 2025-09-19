import { NextResponse } from "next/server";
import { Users } from "@/lib/models/model_user";
import { connectDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password, type} = body;
    const saltRounds = 10;
    let user = await Users.findOne({email});
    if(!user){
      if(type == "login"){
        return NextResponse.json({data: "notExist", message: "You have not an account"});
      }
      const hashedPassword = await bcrypt.hash(String(password), saltRounds);
      user = await Users.create({email, url: "default", password: hashedPassword});
    }
    else{
      if(type == "register"){
        return NextResponse.json({data: "Exist", message: "You already have an account"});
      }
      const truePassword = await bcrypt.compare(String(password), String(user.password));
      if(!truePassword){
        return NextResponse.json({data: "Incorrect", message: "Password is incorrect"});
      }
    }
    const appToken = jwt.sign(
        { id: user._id, email: user.email},
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
    const res = NextResponse.json({ message: "Login successful" });
    res.cookies.set("appToken", appToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    });
    return res;
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Invalid Firebase token" },{status: 401});
  }
}
