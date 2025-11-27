"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function ToastContainer({ toasts, logout }) {
  return (
    <div className="fixed top-6 right-6 flex flex-col gap-2 z-[9999]">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`px-4 py-2 rounded-lg shadow ${
              t.type === "success"
                ? "bg-green-100 text-green-900"
                : t.type === "error"
                ? "bg-red-100 text-red-600"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>

      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
