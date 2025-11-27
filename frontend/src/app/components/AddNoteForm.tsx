"use client";

import { useState } from "react";

export default function AddNoteForm({ onSubmit, categories }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  function submit(e) {
    e.preventDefault();
    onSubmit({ title, content, category });

    setTitle("");
    setContent("");
    setCategory("");
  }

  return (
    <section className="lg:col-span-1">
      <form
        onSubmit={submit}
        className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl shadow-md"
      >
        <label className="font-medium text-gray-700">Title</label>
        <input
          className="w-full p-2 mt-1 border rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="font-medium text-gray-700 mt-3 block">Content</label>
        <textarea
          className="w-full p-2 mt-1 border rounded-lg"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label className="font-medium text-gray-700 mt-3 block">Category</label>
        <select
          className="w-full p-2 mt-1 border rounded-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <button className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold p-2 rounded-lg shadow">
          Add Note
        </button>
      </form>
    </section>
  );
}
