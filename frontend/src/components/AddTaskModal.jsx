export default function AddTaskModal({
  isOpen,
  onClose,
  newTask,
  onChange,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 font-arima">
      <div className="bg-[#E7FBB4] p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add Task</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newTask.title}
            onChange={onChange}
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newTask.description}
            onChange={onChange}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="date"
            name="dueDate"
            value={newTask.dueDate}
            onChange={onChange}
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            name="priority"
            value={newTask.priority}
            onChange={onChange}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select
            name="status"
            value={newTask.status}
            onChange={onChange}
            className="w-full p-2 mb-4 border rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Task
            </button>
            <button
              type="button"
              className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
