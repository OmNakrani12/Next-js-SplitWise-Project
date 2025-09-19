"use client"
import Link from "next/link";
import { useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GoogleLogin from "../firebase/google";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
export default function LoginPage() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  const router = useRouter();
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const type = "login";

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!email || !password){
      alert("Fields are empty!");
      return;
    }
    try{
      // const res = await createUserWithEmailAndPassword(email, password);
      const response = await fetch("api/users/",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email, password, type}),
        credentials : "include",
      })
      const resData = await response.json();
      if(resData.data == "Incorrect"){
        alert("Incorrect password!");
        return;
      }
      else if(resData.data == "notExist"){
        router.push('/register');
        alert("You have not an account!");
        return;
      }
      setEmail('');
      setPassword('');
      if(response.ok){
        router.push('/');
      }
      else{
        alert("Login Failed");
      }
    }
    catch(e){
      console.error(e);
    }
  }
  useEffect(() => {
    const token = Cookies.get("appToken");
    console.log("Token:", token);
    if(token){
      router.push('/');
    }
  },[]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Website Logo"
            className="h-16 w-16"
          />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-600">Login to Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-center">
            <button className="flex w-[90%] justify-center bg-blue-500 text-white border rounded-lg px-6 py-2 hover:bg-blue-600">Submit</button>
          </div>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </form>
        <GoogleLogin/>
        <div className="flex justify-center gap-1">
          <span>Don't have an account?</span>
          <Link href="/register" className="text-blue-500 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}