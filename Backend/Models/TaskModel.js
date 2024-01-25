const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  // Add other document-related fields as needed
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
