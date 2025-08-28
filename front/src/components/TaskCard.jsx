import { useState } from "react";
import { MoreVertical } from "lucide-react";

export default function TaskCard({ title, description, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card p-4 rounded-xl shadow-md dark:shadow-lg relative border transition hover:shadow-2xl hover:-translate-y-0.5" style={{ borderColor: 'var(--border)' }}>
      <h3 className="font-semibold text-lg break-words whitespace-normal">{title}</h3>
      {description && (
        <p className="text-sm muted mt-2 break-words whitespace-normal">{description}</p>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className="absolute top-3 right-3 p-1 hover:bg-gray-100/30 rounded"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-3 top-10 bg-[var(--card)] border rounded shadow z-500" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100/30"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100/30 text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
