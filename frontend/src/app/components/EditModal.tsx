"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function EditModal({ note, close, save }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || "");
  const [category, setCategory] = useState(note.category || "Other");

  function submit() {
    save({
      title,
      content,
      category,
    });
  }

  return (
    <motion.div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl"
      >
        <h2 className="text-xl font-semibold text-gray-800">Edit Note</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg mt-3"
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded-lg mt-3"
          rows={4}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded-lg mt-3"
        >
          <option>Work</option>
          <option>Study</option>
          <option>Personal</option>
          <option>Other</option>
        </select>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={close} className="px-4 py-2 bg-gray-400 rounded-lg">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 rounded-lg"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
