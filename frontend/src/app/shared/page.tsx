"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import loaderAnimation from "../../../public/loader.json"; // ⭐ your loader

type SharedNote = {
  note: {
    id: string;
    title: string;
    content?: string;
    category?: string;
    user: { username: string };
  };
  permission: string;
};

const backend =
  process.env.NEXT_PUBLIC_API_URL || "https://notes-1-sysk.onrender.com";

export default function SharedPage() {
  const [sharedNotes, setSharedNotes] = useState<SharedNote[]>([]);
  const [loading, setLoading] = useState(true); // ⭐ NEW
  const router = useRouter();

  useEffect(() => {
    async function loadShared() {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        const res = await fetch(`${backend}/notes/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const sharedArray = Array.isArray(data) ? data : data?.data || [];
        setSharedNotes(sharedArray);
      } finally {
        setLoading(false); // ⭐ Stop loader
      }
    }

    loadShared();
  }, []);

  return (
    <main className="min-h-screen p-6 bg-white relative">
      {/* ⭐ LOTTIE LOADER OVERLAY */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
          <div className="w-40 h-40">
            <Lottie animationData={loaderAnimation} loop={true} />
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Shared With Me</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sharedNotes.map((item) => (
          <div
            key={item.note.id}
            className="p-4 border bg-blue-50 rounded-xl shadow"
          >
            <h3 className="text-lg font-semibold">{item.note.title}</h3>

            <p className="text-sm text-gray-600 mt-1">
              {item.note.content || "No content"}
            </p>

            <p className="text-xs text-gray-600 mt-2">
              Shared By:{" "}
              <span className="font-semibold">{item.note.user.username}</span>
            </p>

            <span className="text-xs px-3 py-1 bg-blue-200 rounded-full mt-2 inline-block">
              Permission: {item.permission.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
