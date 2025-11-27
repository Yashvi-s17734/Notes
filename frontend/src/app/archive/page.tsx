"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Note = {
  id: string;
  title: string;
  content?: string;
  category?: string;
};

const backend = process.env.NEXT_PUBLIC_API_URL || "https://notes-1-sysk.onrender.com";

export default function ArchivePage() {
  const [archived, setArchived] = useState<Note[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadArchived() {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const res = await fetch(`${backend}/notes/archive`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      const archiveArray = Array.isArray(data) ? data : data?.data || [];
      setArchived(archiveArray);
    }

    loadArchived();
  }, []);

  async function restoreNote(id: string) {
    const token = localStorage.getItem("token");

    await fetch(`${backend}/notes/${id}/restore`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    setArchived((prev) => prev.filter((n) => n.id !== id));
  }

  async function deleteForever(id: string) {
    const token = localStorage.getItem("token");

    await fetch(`${backend}/notes/${id}/delete-forever`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setArchived((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <main className="min-h-screen p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6">Archived Notes</h1>

      {/* <button
        onClick={() => router.push("/")}
        className="mb-6 px-4 py-2 bg-gray-300 rounded-lg"
      >
        ← Back to Notes
      </button> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {archived.map((n) => (
          <div key={n.id} className="p-4 border rounded-xl bg-gray-100 shadow">
            <h3 className="font-semibold">{n.title}</h3>
            <p className="text-sm text-gray-600">{n.content}</p>

            <div className="mt-3 flex gap-3">
              <button
                onClick={() => restoreNote(n.id)}
                className="px-3 py-1 bg-green-500 text-white rounded-lg"
              >
                Restore
              </button>

              <button
                onClick={() => deleteForever(n.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                Delete Forever
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}