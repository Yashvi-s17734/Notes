"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const backend = process.env.NEXT_PUBLIC_API_URL || "https://notes-1-sysk.onrender.com";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const submit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!username || !password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      const res = await fetch(`${backend}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);

        try {
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          if (payload.username) {
            localStorage.setItem("username", payload.username);
          }
        } catch {
          console.warn("JWT decode failed, but login is still fine");
        }

        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Cannot connect to server. Is backend running?");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-yellow-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-8">Log in to your notes</p>
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center mb-6 font-bold animate-pulse">
            Login successful! Taking you to your notes...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center mb-6 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="username"
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-lg"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-yellow-600 font-semibold hover:underline"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
