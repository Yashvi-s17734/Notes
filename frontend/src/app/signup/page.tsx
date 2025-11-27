"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const backend = process.env.NEXT_PUBLIC_API_URL || "https://notes-1-sysk.onrender.com";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!username.trim()) {
      return setError("Username is required");
    }

    if (!email.trim()) {
      return setError("Email is required");
    }

    if (!password.trim()) {
      return setError("Password is required");
    }

    setLoading(true);
    try {
      const res = await fetch(`${backend}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      setLoading(false);
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Cannot connect to server. Is backend running?");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-yellow-200">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Start your journey with us
        </p>
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center mb-6 font-medium animate-pulse">
            Account created successfully! Redirecting to login...
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center mb-6 font-medium">
            {error}
          </div>
        )}
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-300 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Create a password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-lg"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-yellow-600 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
