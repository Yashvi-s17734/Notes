"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Lottie from "lottie-react";
import loaderAnimation from "../../../public/loader.json"; // ⭐ Your loader

const backend = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function InvitePage() {
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email");
  const noteId = params.get("note");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [loader, setLoader] = useState(false); // ⭐ NEW full-screen loader

  async function acceptInvitation() {
    if (!email || !noteId) return;

    if (password.length < 6) {
      setStatusMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setLoader(true); // ⭐ show Lottie

    try {
      const res = await fetch(`${backend}/auth/accept-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          noteId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMsg(data.message || "Something went wrong.");
        setLoading(false);
        setLoader(false);
        return;
      }

      setStatusMsg("Account created! Redirecting...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setStatusMsg("Server error. Try again.");
      setLoader(false);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white flex justify-center items-center p-6 relative">
      {/* ⭐ FULL SCREEN LOTTIE LOADER */}
      {loader && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="w-48 h-48">
            <Lottie animationData={loaderAnimation} loop={true} />
          </div>
        </div>
      )}

      <div className="w-full max-w-md p-6 border rounded-xl shadow bg-white relative z-10">
        <h1 className="text-2xl font-bold">Accept Invitation</h1>

        <p className="text-gray-600 mt-2">
          You are invited to access a note shared with:
        </p>

        <p className="mt-2 font-semibold bg-gray-100 p-2 rounded">{email}</p>

        <label className="block mt-4 font-medium">Create Password</label>
        <input
          type="password"
          placeholder="Enter a password"
          className="w-full p-2 border rounded-lg mt-1"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={acceptInvitation}
          disabled={loading}
          className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 transition text-white font-semibold p-2 rounded-lg"
        >
          {loading ? "Processing..." : "Accept Invitation"}
        </button>

        {statusMsg && (
          <p className="text-center text-sm text-gray-700 mt-4">{statusMsg}</p>
        )}
      </div>
    </main>
  );
}
