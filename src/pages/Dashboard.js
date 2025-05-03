import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import CreateProject from "../components/CreateProject";
import API from "../services/api";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [countTasks, setCountTasks] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskStats, setTaskStats] = useState({
    todo: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchGroupCounts();
    fetchProjects();
    fetchSummery();
  }, []);
  const fetchProjects = async () => {
    try {
      const projRes = await API.get("/projects/myProjects");
      setProjects(projRes.data);
    } catch (error) {
      console.log("Dashboard Load Error:", error);
    }
  };

  const fetchSummery = async () => {
    try {
      const response = await API.get("/tasks/summary");
      if (response.data) {
        setTaskStats(response.data);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const fetchGroupCounts = async () => {
    try {
      const response = await API.get("/tasks/countGroupTasks");
      if (response.data) {
        setCountTasks(response.data);
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await API.delete(`/projects/${projectId}/delete`);
      if (res.status === 200) {
        setProjects((prev) =>
          prev.filter((project) => project._id !== projectId)
        );
      } else {
        console.error(
          "❌ Failed to delete project. Server responded with:",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "❌ Server Error:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar user={user} onLogout={logout} />

      <div className="status-cards">
        <div className="status-card todo">
          <h3>To Do</h3>
          <p>{taskStats.todo || 0}</p>
        </div>
        <div className="status-card in-progress">
          <h3>In Progress</h3>
          <p>{taskStats.inProgress || 0}</p>
        </div>
        <div className="status-card completed">
          <h3>Completed</h3>
          <p>{taskStats.completed || 0}</p>
        </div>
      </div>

      <h3 className="projects-title">Your Projects</h3>

      {isModalOpen && (
        <CreateProject
          onClose={() => setIsModalOpen(false)}
          refreshProjects={fetchProjects}
        />
      )}

      <div className="project-list">
        <button onClick={() => setIsModalOpen(true)} className="nav-btn">
          ➕ Create Project
        </button>
        {projects.map((project) => (
          <div className="project-card" key={project._id}>
            <h4 className="project-name">{project.title}</h4>
            <h6 className="project-name">{project.description}</h6>
            <p className="project-task">
              TASKS: {countTasks?.[project._id] || 0}
            </p>

            <div className="task-actions">
              <Link to={`/projects/${project._id}`} className="View">
                View
              </Link>
              <button
                onClick={() => handleDeleteProject(project._id)}
                className="Delete"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
