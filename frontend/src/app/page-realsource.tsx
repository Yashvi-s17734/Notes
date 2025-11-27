"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AddNoteForm from "./components/AddNoteForm";
import NotesList from "./components/NotesList";
import EditModal from "./components/EditModal";
import ShareModal from "./components/ShareModal";
import ToastContainer from "./components/ToastContainer";

const backend = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function HomeReal() {
  // ---------------- STATES ----------------
  const [notes, setNotes] = useState([]);
  const [archived, setArchived] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [username, setUsername] = useState("");

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortType, setSortType] = useState("newest");

  const [editingNote, setEditingNote] = useState(null);
  const [shareNoteId, setShareNoteId] = useState(null);

  const [toasts, setToasts] = useState([]);

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || "1");

  const router = useRouter();
  const limit = 5;

  // ---------------- TOAST FUNCTION ----------------
  function pushToast(message, type = "info", ttl = 3000) {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, ttl);
  }

  // ---------------- AUTH CHECK ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.username?.toUpperCase() || "");
    } catch {
      router.push("/login");
    }
  }, []);

  // ---------------- FETCH NOTES ----------------
  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        // ACTIVE NOTES
        const res = await fetch(
          `${backend}/notes?page=${currentPage}&limit=${limit}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setNotes(data.data || []);

        // ARCHIVED
        const arch = await fetch(`${backend}/notes/archive`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setArchived(await arch.json());

        // SHARED
        const sharedRes = await fetch(`${backend}/notes/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (sharedRes.ok) setSharedNotes(await sharedRes.json());
      } catch (err) {
        pushToast("Failed to load notes", "error");
      }
    }

    fetchData();
  }, [currentPage]);

  // ---------------- ADD NOTE ----------------
  async function addNote({ title, content, category }) {
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

      const newNote = await res.json();

      if (currentPage === 1) {
        setNotes((prev) => [newNote, ...prev].slice(0, limit));
      }

      pushToast("Note added", "success");
    } catch {
      pushToast("Add failed", "error");
    }
  }

  // ---------------- DELETE NOTE ----------------
  async function deleteNote(id) {
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

  // ---------------- EDIT NOTE ----------------
  async function saveEdit(updateData) {
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

      const updated = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
      setEditingNote(null);

      pushToast("Note updated", "success");
    } catch {
      pushToast("Update failed", "error");
    }
  }

  // ---------------- PIN NOTE ----------------
  async function togglePin(note) {
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

      const updated = await res.json();

      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));

      pushToast(updated.isPinned ? "Pinned" : "Unpinned", "info");
    } catch {
      pushToast("Pin failed", "error");
    }
  }

  // ---------------- FILTERING ----------------
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (filterCategory !== "All")
      result = result.filter((n) => (n.category || "Other") === filterCategory);

    const q = search.trim().toLowerCase();
    if (q)
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          (n.content || "").toLowerCase().includes(q)
      );

    if (sortType === "newest")
      result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    else if (sortType === "oldest")
      result.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
    else if (sortType === "asc")
      result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortType === "desc")
      result.sort((a, b) => b.title.localeCompare(a.title));

    return result;
  }, [notes, search, sortType, filterCategory]);

  // ---------------- LOGOUT ----------------
  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }
  async function archiveNote(id) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${backend}/notes/${id}/archive`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const updated = await res.json();

    // Remove from active notes
    setNotes((prev) => prev.filter((n) => n.id !== id));

    // Add to archived state
    setArchived((prev) => [...prev, updated]);

    pushToast("Note archived", "info");
  } catch {
    pushToast("Archive failed", "error");
  }
}


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

      {/* ---------------- 3-COLUMN LAYOUT ---------------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — ADD NOTE FORM */}
        <AddNoteForm
          onSubmit={addNote}
          categories={["Work", "Study", "Personal", "Other"]}
        />

        {/* RIGHT — NOTES LIST */}
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

          {/* ARCHIVED + SHARED WITH ME will be added after components */}
        </section>
      </div>

      {/* EDIT MODAL */}
      {editingNote && (
        <EditModal
          note={editingNote}
          close={() => setEditingNote(null)}
          save={saveEdit}
        />
      )}

      {/* SHARE MODAL */}
      {shareNoteId && (
        <ShareModal
          noteId={shareNoteId}
          close={() => setShareNoteId(null)}
          backend={backend}
          toast={pushToast}
        />
      )}

      {/* TOASTS */}
      <ToastContainer toasts={toasts} logout={logout} />
    </main>
  );
}
