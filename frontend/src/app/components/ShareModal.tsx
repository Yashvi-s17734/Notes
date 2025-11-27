"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ShareModal({ noteId, backend, close, toast }) {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");

  async function submit() {
    if (!email) return toast("Enter email", "error");

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${backend}/notes/${noteId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, permission }),
      });

      if (!res.ok) {
        const err = await res.json();
        return toast(err.message || "Error sharing", "error");
      }

      toast(`Shared with ${email}`, "success");
      close();
    } catch {
      toast("Network error", "error");
    }
  }

  return (
    <motion.div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl"
      >
        <h2 className="text-xl font-semibold text-gray-800">Share Note</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full p-2 border rounded-lg mt-3"
        />

        <select
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
          className="w-full p-2 border rounded-lg mt-3"
        >
          <option value="view">Can View</option>
          <option value="edit">Can Edit</option>
        </select>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={close} className="px-4 py-2 bg-gray-400 rounded-lg">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Share
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
