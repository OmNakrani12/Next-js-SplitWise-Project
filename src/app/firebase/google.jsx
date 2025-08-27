"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./config";
import { useRouter } from "next/navigation";

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);

      const user = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: result.user.email,
          url: result.user.photoURL,
        }),
      });

      if (user.ok) {
        const userData = await user.json();
        localStorage.setItem("email", result.user.email);
        localStorage.setItem("url", result.user.photoURL);
        console.log("Authentication successful:", userData);
        router.push("/groups");
      } else {
        console.error("Authentication failed:", user.status);
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-col gap-3 p-4 ${loading ? "cursor-wait" : ""}`}
    >
      <button
        onClick={signInWithGoogle}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Sign in with Google"}
      </button>
    </div>
  );
}
