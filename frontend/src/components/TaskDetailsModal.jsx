import { useState } from "react";

export default function TaskDetailsModal({
  isOpen,
  task,
  onClose,
  onChange,
  onUpdate,
  onDelete,
  onAddSubTask,
  onToggleSubTaskStatus,
}) {
  const [newSubTaskTitle, setNewSubTaskTitle] = useState("");

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 font-arima">
      <div className="bg-[#E7FBB4] p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Task Details</h2>
        <form>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={task.title}
            onChange={onChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={task.description}
            onChange={onChange}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="date"
            name="dueDate"
            value={task.dueDate ? task.dueDate.split("T")[0] : ""}
            onChange={onChange}
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            name="priority"
            value={task.priority}
            onChange={onChange}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            name="status"
            value={task.status}
            onChange={onChange}
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          {/* ✅ Sub-tasks Section */}
          <h3 className="text-lg font-semibold mt-4">Sub-Tasks</h3>
          <ul className="mb-4">
            {task.subTasks?.map((subTask) => (
              <li
                key={subTask._id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span
                  className={
                    subTask.status === "Completed" ? "line-through" : ""
                  }
                >
                  {subTask.title}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleSubTaskStatus(subTask);
                  }}
                  className={`text-sm px-2 py-1 rounded ${
                    subTask.status === "Completed"
                      ? "bg-green-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {subTask.status === "Completed" ? "Undo" : "Complete"}
                </button>
              </li>
            ))}
          </ul>

          {/* ✅ Add New Sub-task */}
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="New sub-task"
              value={newSubTaskTitle}
              onChange={(e) => setNewSubTaskTitle(e.target.value)}
              className="flex-grow p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => {
                onAddSubTask(newSubTaskTitle);
                setNewSubTaskTitle("");
              }}
              className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
            >
              Add
            </button>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
