const express = require("express");
const SubTask = require("../models/SubTask");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { taskId, title } = req.body;

    if (!taskId || !title) {
      return res.status(400).json({ msg: "Task ID and title are required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const newSubTask = new SubTask({
      taskId,
      title,
    });

    const savedSubTask = await newSubTask.save();

    task.subTasks.push(savedSubTask._id);
    await task.save();

    res.status(201).json(savedSubTask);
  } catch (err) {
    console.error("Error creating subtask:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/:taskId", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const subTasks = await SubTask.find({ taskId });

    res.json(subTasks);
  } catch (err) {
    console.error("Error fetching subtasks:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid task ID" });
    }

    res.status(500).json({ msg: "Server Error" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const subTaskId = req.params.id;
    const { title, status } = req.body;

    let subTask = await SubTask.findById(subTaskId);
    if (!subTask) {
      return res.status(404).json({ msg: "SubTask not found" });
    }

    const parentTask = await Task.findById(subTask.taskId);
    if (!parentTask) {
      return res.status(404).json({ msg: "Parent task not found" });
    }

    if (parentTask.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    if (title) subTask.title = title;
    if (status) subTask.status = status;

    await subTask.save();

    res.json(subTask);
  } catch (err) {
    console.error("Error updating subtask:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid subtask ID" });
    }

    res.status(500).json({ msg: "Server Error" });
  }
});

router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const subTaskId = req.params.id;
    const { status } = req.body;

    if (!["Pending", "Completed"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }

    let subTask = await SubTask.findById(subTaskId);
    if (!subTask) {
      return res.status(404).json({ msg: "SubTask not found" });
    }

    const parentTask = await Task.findById(subTask.taskId);
    if (!parentTask) {
      return res.status(404).json({ msg: "Parent task not found" });
    }

    if (parentTask.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    subTask.status = status;
    await subTask.save();

    res.json(subTask);
  } catch (err) {
    console.error("Error updating subtask status:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid subtask ID" });
    }

    res.status(500).json({ msg: "Server Error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const subTaskId = req.params.id;

    const subTask = await SubTask.findById(subTaskId);
    if (!subTask) {
      return res.status(404).json({ msg: "SubTask not found" });
    }

    const parentTask = await Task.findById(subTask.taskId);
    if (!parentTask) {
      return res.status(404).json({ msg: "Parent task not found" });
    }

    if (parentTask.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await subTask.deleteOne();

    await Task.findByIdAndUpdate(subTask.taskId, {
      $pull: { subTasks: subTask._id },
    });

    res.json({ msg: "SubTask deleted successfully" });
  } catch (err) {
    console.error("Error deleting subtask:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid subtask ID" });
    }

    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
