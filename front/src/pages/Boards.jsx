import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import BoardCard from "../components/BoardCard";

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState("");
  const [editBoardId, setEditBoardId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // delete modal
  const [deleteBoardId, setDeleteBoardId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  async function fetchBoards() {
    try {
      setLoading(true);
      const res = await api.get("/boards");
      setBoards(res.data);
    } catch (err) {
      console.error("Error fetching boards:", err);
      setErr(err?.response?.data?.message || "Failed to load boards");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setCreating(true);
      const res = await api.post("/boards", { title });
      setBoards((prev) => [...prev, res.data]);
      setShowModal(false);
      setTitle("");
    } catch (err) {
      console.error("Create board failed", err);
      setErr(err?.response?.data?.message || "Failed to create board");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!editTitle.trim()) return;
    try {
      const res = await api.put(`/boards/${editBoardId}`, {
        title: editTitle,
      });
      setBoards((prev) =>
        prev.map((b) => (b._id === editBoardId ? res.data : b))
      );
      setEditBoardId(null);
      setEditTitle("");
    } catch (err) {
      console.error("Update board failed", err);
      setErr(err?.response?.data?.message || "Failed to update board");
    }
  }

  async function confirmDelete() {
    try {
      setDeleting(true);
      await api.delete(`/boards/${deleteBoardId}`);
      setBoards((prev) => prev.filter((b) => b._id !== deleteBoardId));
      setDeleteBoardId(null);
    } catch (err) {
      console.error("Delete board failed", err);
      setErr(err?.response?.data?.message || "Failed to delete board");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-6xl p-6 md:p-10 lg:p-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Boards</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 font-bold rounded shadow hover:bg-blue-700 cursor-pointer transition"
          >
            + Create Board
          </button>
        </div>
        {err && <p className="text-red-600 mb-4">{err}</p>}
        {/* Boards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-lg">Loading...</p>
          ) : boards.length ? (
            boards.map((b) => (
              <BoardCard
                key={b._id}
                title={b.title}
                onView={() => nav(`/boards/${b._id}`)}
                onEdit={() => {
                  setEditBoardId(b._id);
                  setEditTitle(b.title);
                }}
                onDelete={() => setDeleteBoardId(b._id)}
              />
            ))
          ) : (
            <p>No boards yet. Create one to get started.</p>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="card rounded-lg w-full max-w-md p-6 shadow-lg transition-colors">
            <h2 className="text-lg font-semibold mb-3">Create Board</h2>
            <form onSubmit={handleCreate}>
              <input
                className="w-full px-3 py-2 border rounded mb-3 bg-transparent"
                placeholder="Board title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 rounded border cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer font-medium"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editBoardId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="card rounded-lg w-full max-w-md p-6 shadow-lg transition-colors">
            <h2 className="text-lg font-semibold mb-3">Edit Board</h2>
            <form onSubmit={handleUpdate}>
              <input
                className="w-full px-3 py-2 border rounded mb-3 bg-transparent"
                placeholder="Board title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditBoardId(null)}
                  className="px-3 py-2 rounded border cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer font-medium"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteBoardId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="card rounded-lg w-full max-w-md p-6 shadow-lg transition-colors">
            <h2 className="text-lg font-semibold mb-3 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-4">
              Are you sure you want to delete this board? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteBoardId(null)}
                className="px-3 py-2 rounded border cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer font-medium"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
