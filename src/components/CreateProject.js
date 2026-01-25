import React, { useState } from "react";
import { notifySuccess, notifyError } from "../utils/notify";
import API from "../services/api";
import "../styles/createProject.css";
import { Button } from "antd";

const CreateProject = ({ onClose, refreshProjects }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      notifyError("Validation Error", "Project title is required");
      return;
    }

    try {
      await API.post("/projects/create", { title, description });

      notifySuccess("Project Created", "Project added successfully");

      refreshProjects();
      onClose();
    } catch (err) {
      notifyError(
        "Create Failed",
        err.response?.data?.message || "Something went wrong",
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Project</h2>
        {message && <p className="status-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Project Name</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="modal-buttons">
            <Button type="submit" className="save-btn">
              ➕ Create Project
            </Button>
            <Button type="button" className="cancel-btn" onClick={onClose}>
              ✖ Close
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
