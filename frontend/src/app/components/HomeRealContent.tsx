"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AddNoteForm from "./AddNoteForm";
import NotesList from "./NotesList";
import EditModal from "./EditModal";
import ShareModal from "./ShareModal";
import ToastContainer from "./ToastContainer";

const backend = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type Props = {
  currentPage: number;
};

export default function HomeRealContent({ currentPage }: Props) {
  // ────────────────────── STATES ──────────────────────
  const [notes, setNotes] = useState<any[]>([]);
  const [archived, setArchived] = useState<any[]>([]);
  const [sharedNotes, setSharedNotes] = useState<any[]>([]);
  const [username, setUsername] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortType, setSortType] = useState("newest");

  const [editingNote, setEditingNote] = useState<any>(null);
  const [shareNoteId, setShareNoteId] = useState<string | null>(null);

  const [toasts, setToasts] = useState<
    { id: string; message: string; type: string }[]
  >([]);

  const router = useRouter();
  const limit = 5;

  // ────────────────────── TOAST FUNCTION ──────────────────────
  function pushToast(
    message: string,
    type: "info" | "success" | "error" = "info",
    ttl = 3000
  ) {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, ttl);
  }

  // ────────────────────── AUTH CHECK ──────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.username?.toUpperCase() || "");
    } catch {
      router.push("/login");
    }
  }, [router]);

  // ────────────────────── FETCH NOTES ──────────────────────
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        // Active notes
        const res = await fetch(
          `${backend}/notes?page=${currentPage}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setNotes(data.data || []);

        // Archived
        const arch = await fetch(`${backend}/notes/archive`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const archData = await arch.json();
        setArchived(Array.isArray(archData) ? archData : archData?.data || []);

        // Shared
        const sharedRes = await fetch(`${backend}/notes/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (sharedRes.ok) {
          const sharedData = await sharedRes.json();
          setSharedNotes(
            Array.isArray(sharedData) ? sharedData : sharedData?.data || []
          );
        }
      } catch (err) {
        pushToast("Failed to load notes", "error");
      }
    }

    fetchData();
  }, [currentPage, router]);

  // ────────────────────── ADD NOTE ──────────────────────
  async function addNote({
    title,
    content,
    category,
  }: {
    title: string;
    content?: string;
    category?: string;
  }) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backend}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, category }),
      });

      if (!res.ok) throw new Error("Add failed");

      const newNote = await res.json();

      if (currentPage === 1) {
        setNotes((prev) => [newNote, ...prev].slice(0, limit));
      }

      pushToast("Note added", "success");
    } catch {
      pushToast("Add failed", "error");
    }
  }

  // ────────────────────── DELETE NOTE ──────────────────────
  async function deleteNote(id: string) {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${backend}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prev) => prev.filter((n) => n.id !== id));
      pushToast("Note deleted", "info");
    } catch {
      pushToast("Delete failed", "error");
    }
  }

  // ────────────────────── EDIT NOTE ──────────────────────
  async function saveEdit(updateData: {
    title: string;
    content?: string;
    category?: string;
  }) {
    if (!editingNote) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backend}/notes/${editingNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setEditingNote(null);
      pushToast("Note updated", "success");
    } catch {
      pushToast("Update failed", "error");
    }
  }

  // ────────────────────── PIN NOTE ──────────────────────
  async function togglePin(note: any) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backend}/notes/${note.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPinned: !note.isPinned }),
      });

      if (!res.ok) throw new Error("Pin failed");

      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      pushToast(updated.isPinned ? "Pinned" : "Unpinned", "info");
    } catch {
      pushToast("Pin failed", "error");
    }
  }

  // ────────────────────── ARCHIVE NOTE ──────────────────────
  async function archiveNote(id: string) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backend}/notes/${id}/archive`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Archive failed");

      const updated = await res.json();
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setArchived((prev) => [...prev, updated]);
      pushToast("Note archived", "info");
    } catch {
      pushToast("Archive failed", "error");
    }
  }

  // ────────────────────── LOGOUT ──────────────────────
  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  // ────────────────────── FILTERED NOTES ──────────────────────
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (filterCategory !== "All") {
      result = result.filter((n) => (n.category || "Other") === filterCategory);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.content || "").toLowerCase().includes(q)
      );
    }

    if (sortType === "newest") {
      result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    } else if (sortType === "oldest") {
      result.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    } else if (sortType === "asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortType === "desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [notes, search, sortType, filterCategory]);

  // ────────────────────── RENDER ──────────────────────
  return (
    <main className="min-h-screen p-6 bg-white">
      <header className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Notes — <span className="text-yellow-600">{username}</span>
        </h1>

        <button
          onClick={() => {
            setFilterCategory("All");
            setSearch("");
          }}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 transition text-gray-900 font-medium rounded-lg shadow"
        >
          Clear Filters
        </button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AddNoteForm
          onSubmit={addNote}
          categories={["Work", "Study", "Personal", "Other"]}
        />

        <section className="lg:col-span-2">
          <NotesList
            filtered={filteredNotes}
            search={search}
            setSearch={setSearch}
            sortType={sortType}
            setSortType={setSortType}
            onPin={togglePin}
            onEdit={setEditingNote}
            onDelete={deleteNote}
            onShare={setShareNoteId}
            onArchive={archiveNote}
          />
        </section>
      </div>

      {editingNote && (
        <EditModal
          note={editingNote}
          close={() => setEditingNote(null)}
          save={saveEdit}
        />
      )}

      {shareNoteId && (
        <ShareModal
          noteId={shareNoteId}
          close={() => setShareNoteId(null)}
          backend={backend}
          toast={pushToast}
        />
      )}

      <ToastContainer toasts={toasts} logout={logout} />
    </main>
  );
}
