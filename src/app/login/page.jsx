"use client"
import Link from "next/link";
import { useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GoogleLogin from "../firebase/google";
export default function LoginPage() {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  const router = useRouter();
  
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!email || !password){
      alert("Fields Are Empty!");
      return;
    }
    try{
      const res = await createUserWithEmailAndPassword(email, password);
      console.log(res);
      setEmail('');
      setPassword('');
      router.push('/');
    }
    catch(e){
      console.error(e);
    }
  }
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
            <button className="flex mx-auto bg-blue-500 text-white border rounded-lg px-6 py-2 ">Submit</button>
        </form>
        <GoogleLogin/>
      </div>
    </div>
  );
}