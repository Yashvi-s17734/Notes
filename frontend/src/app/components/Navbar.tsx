"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function navigate(path: string) {
    setLoading(true);
    setOpen(false);
    setTimeout(() => {
      router.push(path);
    }, 150);
  }

  function logout() {
    setLoading(true);

    localStorage.removeItem("token");
    setTimeout(() => {
      router.push("/login");
    }, 150);
  }

  return (
    <nav className="w-full bg-yellow-300 shadow p-4 relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Notes App
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-1 bg-white rounded-md shadow"
          >
            Notes
          </button>

          <button
            onClick={() => navigate("/archive")}
            className="px-4 py-1 bg-white rounded-md shadow"
          >
            Archive
          </button>

          <button
            onClick={() => navigate("/shared")}
            className="px-4 py-1 bg-white rounded-md shadow"
          >
            Shared With Me
          </button>

          <button
            onClick={logout}
            className="px-4 py-1 bg-red-500 text-white rounded-md shadow"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-2xl font-bold"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="mt-3 flex flex-col gap-2 md:hidden">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-white rounded-md shadow"
          >
            Notes
          </button>

          <button
            onClick={() => navigate("/archive")}
            className="px-4 py-2 bg-white rounded-md shadow"
          >
            Archive
          </button>

          <button
            onClick={() => navigate("/shared")}
            className="px-4 py-2 bg-white rounded-md shadow"
          >
            Shared With Me
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-md shadow"
          >
            Logout
          </button>
        </div>
      )}

      {/* 🔥 Navigation Loader */}
      {loading && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-200">
          <div className="h-full w-full animate-pulse bg-yellow-500"></div>
        </div>
      )}
    </nav>
  );
}
