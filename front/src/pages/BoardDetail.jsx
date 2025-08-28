import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import TaskCard from "../components/TaskCard";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

function BoardDetail() {
  const { id } = useParams();
  const boardId = id;
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTask, setEditTask] = useState({ title: "", description: "", status: "todo" });
  const [err, setErr] = useState("");
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [boardId]);

  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await api.get(`/${boardId}/tasks`);
      const allTasks = res.data.tasks || [];
      const grouped = {
        todo: allTasks.filter((t) => t.status === "todo"),
        inProgress: allTasks.filter((t) => t.status === "inProgress"),
        done: allTasks.filter((t) => t.status === "done"),
      };
      setTasks(grouped);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setErr(error?.response?.data?.message || "Failed to load Tasks");
    } finally {
      setLoading(false);
    }
  }

  async function createTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setCreating(true);
      const res = await api.post(`/${boardId}/tasks`, {
        title,
        description
      });
      const newTask = res.data.task;
      setTasks((prev) => ({
        ...prev,
        [newTask.status]: [...prev[newTask.status], newTask],
      }));
      setTitle("");
      setDescription("");
      setShowModal(false);
    } catch (error) {
      console.error("Error creating task:", error);
      setErr(error?.response?.data?.message || "Failed to create Task");
    } finally {
      setCreating(false);
    }
  }

  async function updateTask(e) {
    e.preventDefault();
    if (!editTask.title.trim()) return;
    try {
      const res = await api.put(`/tasks/${editTaskId}`, editTask);
      // await fetchTasks();
      const updatedTask = res.data.task;
      setTasks((prev) => {
        // remove from old column
        const oldStatus = editTask.status;
        const newStatus = updatedTask.status;

        const newState = {
          ...prev,
          [oldStatus]: prev[oldStatus].filter((t) => t._id !== updatedTask._id),
        };

        // add to new column
        return {
          ...newState,
          [newStatus]: [...newState[newStatus], updatedTask],
        };
      });

      setEditTaskId(null);
      setEditTask({ title: "", description: "" })
    } catch (error) {
      console.error("Error updating task:", error);
      setErr(error?.response?.data?.message || "Failed to update Task");
    }
  }

  async function deleteTask() {
    try {
      await api.delete(`/tasks/${deleteTaskId}`);
      setTasks((prev) => ({
        ...prev,
        [deleteStatus]: prev[deleteStatus].filter((t) => t._id !== deleteTaskId),
      }));
      setDeleteTaskId(null);
      setDeleteStatus(null);
    } catch (error) {
      console.error("Error deleting task:", error);
      setErr(error?.response?.data?.message || "Failed to delete Task");
    }
  }

  // Drag and drop
  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId &&
      source.index === destination.index) return;

    const sourceTasks = Array.from(tasks[source.droppableId]);
    const [moved] = sourceTasks.splice(source.index, 1);
    const destTasks = Array.from(tasks[destination.droppableId]);
    moved.status = destination.droppableId;
    destTasks.splice(destination.index, 0, moved);

    setTasks((prev) => ({
      ...prev,
      [source.droppableId]: sourceTasks,
      [destination.droppableId]: destTasks,
    }));

    // Update backend
    api.put(`/tasks/${moved._id}`, { ...moved, status: destination.droppableId });
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-6xl p-6 md:p-10 lg:p-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Board Tasks</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 font-bold rounded shadow hover:bg-blue-700 cursor-pointer transition"
          >
            + Create Task
          </button>
        </div>
        {err && <p className="text-red-600 mb-4">{err}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {["todo", "inProgress", "done"].map((col) => (
                <Droppable droppableId={col} key={col}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="card rounded-xl p-6 min-h-[360px] border pt-6"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <h2 className="card-header-sticky text-2xl font-bold mb-6 capitalize">
                        {col === "inProgress" ? "In Progress" : col}
                      </h2>
                      {tasks[col].map((task, idx) => (
                        <Draggable
                          draggableId={task._id}
                          index={idx}
                          key={task._id}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              className="mb-3"
                            >
                              <TaskCard
                                title={task.title}
                                description={task.description}
                                onEdit={() => {
                                  setEditTaskId(task._id);
                                  setEditTask({
                                    title: task.title,
                                    description: task.description,
                                    status: task.status,
                                  });
                                }}
                                onDelete={() => {
                                  setDeleteTaskId(task._id);
                                  setDeleteStatus(task.status);
                                }}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="card rounded-lg w-full max-w-md p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Create Task</h2>
            <form onSubmit={createTask}>
              <input
                className="w-full px-3 py-2 border rounded mb-3 bg-transparent"
                placeholder="Task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full px-3 py-2 border rounded mb-3 bg-transparent"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
      {editTaskId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="card rounded-lg w-full max-w-md p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Edit Task</h2>
            <form onSubmit={updateTask}>
              <input
                className="w-full px-3 py-2 border rounded mb-3 bg-transparent"
                placeholder="Task title"
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
              />
              <textarea
                className="w-full px-3 py-2 border rounded mb-3 bg-transparent"
                placeholder="Description"
                value={editTask.description}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditTaskId(null)}
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
      {deleteTaskId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-40">
          <div className="card rounded-lg w-full max-w-md p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-3 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTaskId(null)}
                className="px-3 py-2 rounded border cursor-pointer font-medium"
              >
                Cancel
              </button>
              <button
                onClick={deleteTask}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardDetail;
