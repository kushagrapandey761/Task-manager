const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const SubTask = require("../models/SubTask")

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    res.json(task);
  } catch (err) {
    console.error("Error fetching task:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid task ID" });
    }

    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const newTask = new Task({
      userId: req.user.id,
      title,
      description,
      dueDate,
      priority,
      status,
    });

    await newTask.save();

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, dueDate, priority, status, subTasks } =
      req.body;

    let task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: { title, description, dueDate, priority, status, subTasks } },
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid task ID" });
    }

    res.status(500).json({ msg: "Server Error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;

    // ✅ Delete all sub-tasks associated with the task
    await SubTask.deleteMany({ taskId });

    // ✅ Delete the task itself
    await Task.findByIdAndDelete(taskId);

    res.json({ msg: "Task and all associated sub-tasks deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});
module.exports = router;
