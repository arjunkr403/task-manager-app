import { useState } from "react";
import { MoreVertical } from "lucide-react";

export default function BoardCard({ title, onView, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="card rounded-xl shadow-lg p-5 relative transition transform hover:-translate-y-1 hover:shadow-2xl animate-fadeIn border" style={{ borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold truncate break-words whitespace-normal max-w-[70%]">{title}</h2>

        {/* Menu */}
        <div className="relative ">
          <button
            className="p-1 rounded hover:bg-gray-100/40 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical className="w-5 h-5 cursor-pointer" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-28 card shadow-lg rounded z-50">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100/40 cursor-pointer font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100/40 cursor-pointer font-semibold"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View Button */}
      <button
        onClick={onView}
        className="px-4 py-2 rounded-lg transition cursor-pointer bg-gradient-to-r from-[var(--text)] to-[var(--text)]/90 text-[var(--card)] hover:scale-[1.01] font-semibold"
        style={{ borderColor: 'var(--border)' }}
      >
        View Tasks
      </button>

    </div>
  );
}
