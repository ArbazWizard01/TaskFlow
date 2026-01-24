import React, { useState } from "react";
import { notifySuccess, notifyError } from "../utils/notify";
import API from "../services/api";
import "../styles/addTask.css";

const AddTask = ({ onClose, projectId, refreshTasks }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "Todo",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!task.title.trim()) {
    notifyError("Validation Error", "Title is required");
    return;
  }

  try {
    const res = await API.post(`/tasks/${projectId}/create`, task);

    if (res.status === 201) {
      notifySuccess("Task Created", "Task added successfully");

      onClose();
      refreshTasks();
    }
  } catch (error) {
    notifyError(
      "Create Failed",
      error.response?.data?.message || "Server error"
    );
  }
};


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Task</h2>
        {message && <p className="status-message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            name="title"
            id="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />

          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            id="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Enter task description"
          ></textarea>

          <label htmlFor="status">Status:</label>
          <select
            name="status"
            id="status"
            value={task.status}
            onChange={handleChange}
          >
            <option value="Todo">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="modal-buttons">
            <button type="submit" className="save-btn">
              ➕ Add Task
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              ✖ Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
