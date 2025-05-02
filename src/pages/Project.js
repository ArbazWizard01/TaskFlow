import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/project.css";
import { AuthContext } from "../contexts/AuthContext";
import AddTask from "../components/AddTask";

const Project = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false); 

  const fetchProjectDetails = async () => {
    try {
      const res = await API.get(`/projects/${id}`);
      if (res.data) {
        setProject(res.data);
      }
    } catch (error) {
      console.log("❌ Failed to fetch project details:", error);
    }
  };

  const fetchTasksDetails = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      if (res.data) {
        setTasks(res.data);
      }
    } catch (error) {
      console.log("❌ Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    fetchTasksDetails();
    setLoading(false);
  },[id]); 

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditedTask({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveClick = async (taskId) => {
    try {
      await API.patch(`/tasks/${taskId}/update`, editedTask);
      await fetchTasksDetails();
      setEditingTaskId(null);
      setEditedTask({});
      setIsModalOpen(false);
    } catch (error) {
      console.error("❌ Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}/delete`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("❌ Failed to delete task:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingTaskId(null);
    setEditedTask({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <p>Loading project...</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="project-detail-container">
      <div className="project-header">
        <h2>{project.title}</h2>
        <p>
          <strong>Created By:</strong> {user.email}
        </p>
        <p>
          <strong>Description:</strong> {project.description}
        </p>
        <button onClick={() => setIsAddTaskOpen(true)} className="add-task-btn">
          ➕ Add Task
        </button>
      </div>

      {/* ✅ Modal for Adding Task */}
      {isAddTaskOpen && (
        <AddTask
          onClose={() => setIsAddTaskOpen(false)}
          projectId={id}
          refreshTasks={fetchTasksDetails}
        />
      )}

      <div className="task-section">
        <h3>Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks available for this project.</p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <div key={task._id} className="task-card">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <p>
                  <strong>Status:</strong> {task.status}
                </p>
                <div className="task-actions">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={editedTask.title || ""}
              onChange={handleChange}
              placeholder="Title"
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={editedTask.description || ""}
              onChange={handleChange}
              placeholder="Description"
            ></textarea>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={editedTask.status || "Todo"}
              onChange={handleChange}
            >
              <option value="Todo">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="modal-buttons">
              <button
                onClick={() => handleSaveClick(editingTaskId)}
                className="save"
              >
                Save
              </button>
              <button onClick={handleCancelEdit} className="cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
