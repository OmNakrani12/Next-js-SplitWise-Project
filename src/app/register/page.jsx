"use client";
import Link from "next/link";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import GoogleLogin from "../firebase/google";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false);
    const router = useRouter();
    const type = "register";

    const [createUserWithEmailAndPassword, user, loading, hookError] =
    useCreateUserWithEmailAndPassword(auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        if (password !== confirmPassword) {
            setError(true);
            return;
        }
        try {
            const checkRes = await fetch("/api/users", {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({email, password, type}),
            })
            const checkInfo = await checkRes.json();
            if(checkInfo.data == "Exist"){
              router.push('/login');
              alert("You already have an account!");
              return;
            }
            const res = await createUserWithEmailAndPassword(email, password);
            if(res){
              console.log("Registration successfully done");
            }
            localStorage.setItem("email", email);
            localStorage.setItem("name", name);

            router.push("/dashboard");
        } catch (err) {
            console.error("Registration error:", err);
            setError("Failed to register. Try again.");
        }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="Website Logo" className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-600">
          Create your account
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Name
            </label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              placeholder="Enter your email"
              required
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
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Confirm password
            </label>
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
              placeholder="Confirm your password"
              required
            />
            {
              error ? (
                <span className="ml-2 text-red-500">password will be same as above</span>
              ) : null
            }
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="flex w-[90%] justify-center bg-blue-500 text-white border rounded-lg px-6 py-2 hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Submit"}
            </button>
          </div>
          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </form>
        <GoogleLogin />
        <div className="mt-2 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
