"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function NotesList({
  filtered,
  search,
  setSearch,
  sortType,
  setSortType,
  onPin,
  onEdit,
  onDelete,
  onShare,
  onArchive   // <-- add this
}) {

  return (
    <>
      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="flex-1 p-2 border rounded-lg"
        />

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {filtered.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`p-4 rounded-xl border shadow-sm ${
                n.isPinned ? "bg-yellow-100 border-yellow-300" : "bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800">{n.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{n.content}</p>

              <div className="flex items-center justify-between mt-3">
                <span className="px-2 py-1 rounded-full text-xs bg-yellow-200 text-yellow-800">
                  {n.category || "Other"}
                </span>

                <div className="flex items-center gap-3">
                  <button onClick={() => onPin(n)} className="text-gray-800">
                    {n.isPinned ? "⭐" : "☆"}
                  </button>

                  <button
                    onClick={() => onEdit(n)}
                    className="text-yellow-600 font-medium"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(n.id)}
                    className="text-red-600 font-medium"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => onShare(n.id)}
                    className="text-blue-600 font-medium"
                  >
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
