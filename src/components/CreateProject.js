import React, { useState } from "react";
import API from "../services/api";
import "../styles/createProject.css";

const CreateProject = ({ onClose, refreshProjects }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("❌ Project title is required");
      return;
    }

    try {
      await API.post("/projects/create", { title, description });
      setMessage("✅ Project created successfully!");

      setTimeout(() => {
        setMessage("");
        refreshProjects(); // ✅ Fetch new projects immediately
        onClose(); // ✅ Close modal after success
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "❌ Something went wrong");
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
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Description (optional)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="modal-buttons">
            <button type="submit" className="save-btn">➕ Create Project</button>
            <button type="button" className="cancel-btn" onClick={onClose}>✖ Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
