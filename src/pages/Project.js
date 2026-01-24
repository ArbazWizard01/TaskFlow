import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/project.css";
import { AuthContext } from "../contexts/AuthContext";
import AddTask from "../components/AddTask";

const Project = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const fetchProjectDetails = async () => {
    const res = await API.get(`/projects/${id}`);
    setProject(res.data);
  };

  const fetchTasksDetails = async () => {
    const res = await API.get(`/tasks/${id}`);
    setTasks(res.data);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProjectDetails(), fetchTasksDetails()]);
      setLoading(false);
    };

    loadData();
  }, [id]);

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveClick = async () => {
    await API.patch(`/tasks/${editingTaskId}/update`, editedTask);
    fetchTasksDetails();
    setIsModalOpen(false);
  };

  const handleDeleteTask = async (taskId) => {
    await API.delete(`/tasks/${taskId}/delete`);
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  if (loading) {
    return (
      <div className="project-loader">
        <div className="skeleton-header"></div>
        <div className="skeleton-task"></div>
        <div className="skeleton-task"></div>
        <div className="skeleton-task"></div>
      </div>
    );
  }

  return (
    <div className="project-container">

      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ⬅ Dashboard
      </button>

      <div className="project-header">
        <div>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <small>Owner: {user.email}</small>
        </div>

        <button
          className="add-task-btn"
          onClick={() => setIsAddTaskOpen(true)}
        >
          + New Task
        </button>
      </div>

      {isAddTaskOpen && (
        <AddTask
          projectId={id}
          refreshTasks={fetchTasksDetails}
          onClose={() => setIsAddTaskOpen(false)}
        />
      )}

      <div className="task-grid">
        {tasks.length === 0 ? (
          <p className="empty-text">No tasks yet 🚀</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="task-card">

              <div className="task-top">
                <h4>{task.title}</h4>
                <span className={`status-badge ${task.status.replace(" ", "-")}`}>
                  {task.status}
                </span>
              </div>

              <p className="task-desc">{task.description}</p>

              <div className="task-footer">
                <button
                  className="task-edit-btn"
                  onClick={() => handleEditClick(task)}
                >
                  Edit
                </button>

                <button
                  className="task-delete-btn"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-modal">

            <h3>Edit Task</h3>

            <input
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({ ...editedTask, title: e.target.value })
              }
              placeholder="Title"
            />

            <textarea
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({ ...editedTask, description: e.target.value })
              }
              placeholder="Description"
            />

            <select
              value={editedTask.status}
              onChange={(e) =>
                setEditedTask({ ...editedTask, status: e.target.value })
              }
            >
              <option>Todo</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSaveClick}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>
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
