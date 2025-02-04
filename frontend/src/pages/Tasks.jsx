import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";

export default function Tasks() {
  const navigate = useNavigate();
  const [isPendingClicked, setIsPendingClicked] = useState(true);
  const [isCompletedClicked, setIsCompletedClicked] = useState(false);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    fetchTasks();
  }, [navigate]);

  async function fetchTasks() {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setPendingTasks(data.filter((task) => task.status === "Pending"));
      setCompletedTasks(data.filter((task) => task.status === "Completed"));
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }
  const handleAddTaskClick = () => {
    setIsAddModalOpen(true);
  };

  const handlePendingClick = () => {
    setIsPendingClicked(true);
    setIsCompletedClicked(false);
  };

  const handleCompletedClick = () => {
    setIsPendingClicked(false);
    setIsCompletedClicked(true);
  };

  const handleTaskClick = async (task) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/subtasks/${task._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch sub-tasks");

      const subTasks = await response.json();
      setSelectedTask({ ...task, subTasks });
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching sub-tasks:", err);
    }
  };

  const handleAddSubTask = async (title) => {
    if (!title) return;

    const token = localStorage.getItem("token");
    const newSubTask = {
      title,
      taskId: selectedTask._id, // ✅ Reference to parent task
    };

    try {
      const response = await fetch("http://localhost:5000/api/subtasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSubTask),
      });

      if (!response.ok) throw new Error("Failed to add sub-task");

      const createdSubTask = await response.json();
      setSelectedTask((prev) => ({
        ...prev,
        subTasks: [...prev.subTasks, createdSubTask],
      }));
    } catch (err) {
      console.error("Error adding sub-task:", err);
    }
  };

  const handleToggleSubTaskStatus = async (subTask) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/subtasks/${subTask._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: subTask.status === "Completed" ? "Pending" : "Completed",
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update sub-task");

      // ✅ Update sub-task status locally
      setSelectedTask((prev) => ({
        ...prev,
        subTasks: prev.subTasks.map((st) =>
          st._id === subTask._id
            ? {
                ...st,
                status:
                  subTask.status === "Completed" ? "Pending" : "Completed",
              }
            : st
        ),
      }));
    } catch (err) {
      console.error("Error updating sub-task:", err);
    }
  };


  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleInputChange = (e) => {
    if (isModalOpen && selectedTask) {
      setSelectedTask({ ...selectedTask, [e.target.name]: e.target.value });
    } else {
      setNewTask({ ...newTask, [e.target.name]: e.target.value });
    }
  };

  const handleUpdateTask = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${selectedTask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(selectedTask),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      fetchTasks(); // Refresh tasks after updating
      handleCloseModal();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${selectedTask._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      fetchTasks(); // Refresh tasks after deleting
      handleCloseModal();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const createdTask = await response.json();

      if (createdTask.status === "Pending") {
        setPendingTasks([...pendingTasks, createdTask]);
      } else {
        setCompletedTasks([...completedTasks, createdTask]);
      }
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
      });
      handleCloseModal();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <>
      <div className="flex bg-[#27445D] h-screen justify-center">
        <div className="w-[90%] mt-10">
          <div className="flex flex-row justify-center space-x-96">
            <button
              onClick={handlePendingClick}
              className={`font-arima font-semibold text-white border border-white p-4 rounded-xl ${
                isPendingClicked ? "bg-black" : ""
              }`}
            >
              Pending
            </button>
            <button
              onClick={handleCompletedClick}
              className={`font-arima font-semibold text-white border border-white p-4 rounded-xl ${
                isCompletedClicked ? "bg-black" : ""
              }`}
            >
              Completed
            </button>
            <button
              onClick={handleAddTaskClick}
              className={`font-arima font-semibold text-white border border-white p-4 rounded-xl`}
            >
              Add Task
            </button>
          </div>

          <div className="mt-10 flex justify-center">
            {isPendingClicked && (
              <div className="flex flex-wrap">
                {pendingTasks.length > 0 ? (
                  pendingTasks.map((task) => (
                    <div key={task._id} onClick={() => handleTaskClick(task)}>
                      <TaskCard
                        title={task.title}
                        description={task.description}
                        dueDate={task.dueDate}
                        priority={task.priority}
                        status={task.status}
                        subtasks={task.subtasks}
                      />
                    </div>
                  ))
                ) : (
                  <p className="font-arima text-white text-xl">
                    No tasks to display, kindly add a new task.
                  </p>
                )}
              </div>
            )}

            {isCompletedClicked && (
              <div className="flex flex-wrap">
                {completedTasks.length ? (
                  completedTasks.map((task) => (
                    <div key={task._id} onClick={() => handleTaskClick(task)}>
                      <TaskCard
                        title={task.title}
                        description={task.description}
                        dueDate={task.dueDate}
                        priority={task.priority}
                        status={task.status}
                        subtasks={task.subtasks}
                      />
                    </div>
                  ))
                ) : (
                  <p className="font-arima text-white text-xl">
                    No tasks to display, kindly add a new task.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        newTask={newTask}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
      />

      {/* ✅ Task Details Modal */}
      <TaskDetailsModal
        isOpen={isModalOpen}
        task={selectedTask}
        onClose={handleCloseModal}
        onChange={handleInputChange}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onAddSubTask={handleAddSubTask}
        onToggleSubTaskStatus={handleToggleSubTaskStatus}
      />
    </>
  );
}
