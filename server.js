import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  dueDate: Date,
  priority: { type: String, default: "Medium" },
  completed: { type: Boolean, default: false }
});
const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/tasks", async (req, res) => res.json(await Task.find()));
app.post("/tasks", async (req, res) => {
  let { title, dueDate } = req.body;
  let priority = title.toLowerCase().includes("urgent") ? "High" : "Low";
  const task = new Task({ title, dueDate, priority });
  await task.save();
  res.json(task);
});
app.put("/tasks/:id", async (req, res) => {
  res.json(await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: "Task deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
