const express = require("express");
const router = express.Router();
const Task = require("../Models/TaskModel");

router.post("/addTask", async (req, res) => {
  let success = false;
  try {
    const { title, description, date } = req.body;
    const ownerId = req.body.id;
    // console.log(title, description, date, ownerId);
    // Create a new task
    const task = new Task({
      title,
      description,
      dueDate: date,
      owner: ownerId,
    });

    // Save the task to the database
    await task.save();
    success = true;
    let tasks = await Task.find({ owner: ownerId });
    // Return the newly created task details
    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task,
      tasks,
    });
  } catch (error) {
    console.error("Error creating task:", error.message);
    return res.status(500).json({
      success,
      message: error.message,
      error: "Internal Server Error",
    });
  }
});

router.get("/getTasks/:id", async (req, res) => {
  let success = false;
  try {
    const userId = req?.params.id;

    // Check if the user has access to view documents
    const tasks = await Task.find({ owner: userId });

    if (!tasks || tasks.length === 0) {
      return res
        .status(404)
        .json({ success, message: "No tasks found for this user." });
    }

    success = true;
    return res
      .status(200)
      .json({ tasks, success, message: "Tasks fetched successfully." });
  } catch (error) {
    console.error("Error fetching documents:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
      success,
    });
  }
});

router.put("/editTask/:taskId", async (req, res) => {
  let success = false;
  try {
    const taskId = req.params.taskId;
    const { title, description, date } = req.body;
    const userId = req?.body?.id;
    // Check if the task exists
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({
        success,
        message: "Task not found.",
        error: "Not Found",
      });
    }
    if (existingTask.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success,
        message: "Permission denied - You are not the owner of this task",
      });
    }
    // Update the task properties
    existingTask.title = title;
    existingTask.description = description;
    existingTask.dueDate = date;

    // Save the updated task to the database
    await existingTask.save();
    success = true;

    // Retrieve updated tasks after saving
    let tasks = await Task.find({ owner: existingTask.owner });

    // Return the updated task details
    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task: existingTask,
      tasks,
    });
  } catch (error) {
    console.error("Error updating task:", error.message);
    return res.status(500).json({
      success,
      message: error.message,
      error: "Internal Server Error",
    });
  }
});

// router.delete("/deleteTask/:id", async (req, res) => {
//   let success = false;
//   try {
//     const documentId = req?.params?.id;
//     const userId = req?.body?.id;
//     // Check if the user has access to delete the document
//     const document = await Document.findById(documentId);
//     if (!document) {
//       return res.status(404).json({ success, message: "Task not found." });
//     }
//     if (document.owner.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success,
//         message: "Permission denied - You are not the owner of this task",
//       });
//     }

//     // Delete the document
//     let deletedDoc = await Task.findByIdAndDelete(documentId);

//     let documents = await Task.find();
//     success = true;
//     return res
//       .status(200)
//       .json({ success, message: "Document deleted successfully.", documents });
//   } catch (error) {
//     console.error("Error deleting document:", error.message);
//     return res.status(500).json({
//       error: "Internal Server Error",
//       message: error.message,
//       success,
//     });
//   }
// });
router.delete("/deleteTask/:taskId", async (req, res) => {
  let success = false;
  try {
    const taskId = req.params.taskId;
    const userId = req?.body?.id;

    // Check if the task exists
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({
        success,
        message: "Task not found.",
        error: "Not Found",
      });
    }

    // Check if the user has permission to delete the task
    if (existingTask.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success,
        message: "Permission denied - You are not the owner of this task",
      });
    }

    // Remove the task from the database
    await Task.findByIdAndDelete(taskId);
    success = true;

    // Retrieve updated tasks after deletion
    let tasks = await Task.find({ owner: existingTask.owner });

    // Return success message along with the updated list of tasks
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
      tasks,
    });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    return res.status(500).json({
      success,
      message: error.message,
      error: "Internal Server Error",
    });
  }
});

module.exports = router;
