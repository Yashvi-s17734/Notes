"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ⭐ Added Lottie Loader
import Lottie from "lottie-react";
import loaderAnimation from "../../../public/loader.json";

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
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true); // ⭐ Show Lottie only once

  const router = useRouter();

  useEffect(() => {
    async function loadShared() {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      setLoading(true);

      const res = await fetch(`${backend}/notes/shared`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const sharedArray = Array.isArray(data) ? data : data?.data || [];

      setSharedNotes(sharedArray);
      setLoading(false);
      setFirstLoad(false); // ⭐ Next refresh will show skeleton
    }

    loadShared();
  }, []);

  // ⭐ Skeleton Card
  const SkeletonCard = () => (
    <div className="animate-pulse p-4 rounded-xl border shadow bg-gray-100">
      <div className="h-5 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mt-2"></div>
      <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
      <div className="h-4 bg-gray-300 rounded mt-3 w-1/3"></div>
      <div className="h-4 bg-gray-300 rounded mt-2 w-1/4"></div>
    </div>
  );

  return (
    <main className="min-h-screen p-6 bg-white relative">
      {/* ⭐ Fullscreen LOTTIE only on FIRST load */}
      {loading && firstLoad && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-48 h-48">
            <Lottie animationData={loaderAnimation} loop={true} />
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">Shared With Me</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* ⭐ Skeleton after first load */}
        {loading && !firstLoad ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          sharedNotes.map((item) => (
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
          ))
        )}
      </div>
    </main>
  );
}
