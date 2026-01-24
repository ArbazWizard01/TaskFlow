import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import CreateProject from "../components/CreateProject";
import API from "../services/api";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

import { Card, Statistic, Row, Col, Skeleton, Modal } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [countTasks, setCountTasks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [taskStats, setTaskStats] = useState({
    todo: 0,
    inProgress: 0,
    completed: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      await Promise.all([fetchGroupCounts(), fetchProjects(), fetchSummary()]);

      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const fetchProjects = async () => {
    try {
      const projRes = await API.get("/projects/myProjects");
      setProjects(projRes.data);
    } catch (error) {
      console.log("Dashboard Load Error:", error);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await API.get("/tasks/summary");

      if (response.data) {
        const data = response.data;

        setTaskStats({
          todo: data.todo || data.Todo || 0,
          inProgress: data.inProgress || data["In Progress"] || 0,
          completed: data.completed || data.Completed || 0,
        });
      }
      console.log("Summary API:", response.data);
    } catch (err) {
      console.log("Summary Error: ", err);
    }
  };

  const fetchGroupCounts = async () => {
    try {
      const response = await API.get("/tasks/countGroupTasks");
      if (response.data) {
        setCountTasks(response.data);
      }
    } catch (err) {
      console.log("Count Error: ", err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await API.delete(`/projects/${projectId}/delete`);

      if (res.status === 200) {
        setProjects((prev) =>
          prev.filter((project) => project._id !== projectId),
        );
      }
    } catch (error) {
      console.error("Delete Failed:", error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar user={user} onLogout={logout} />

      {/* ===== DASHBOARD STATS ===== */}

      <Row gutter={16} className="dashboard-stats">
        <Col span={8}>
          <Card className="stat-card">
            <Statistic
              title="To Do"
              value={taskStats.todo}
              prefix={<OrderedListOutlined />}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card className="stat-card">
            <Statistic
              title="In Progress"
              value={taskStats.inProgress}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card className="stat-card">
            <Statistic
              title="Completed"
              value={taskStats.completed}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* ===== PROJECT SECTION ===== */}

      <div className="project-header">
        <h3>Your Projects</h3>

        <div className="dashboard-actions">
          <button onClick={() => setIsModalOpen(true)} className="create-btn">
            ➕ Create Project
          </button>
        </div>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <Card key={project._id} className="project-card" hoverable>
              <h4 className="project-title">{project.title}</h4>

              <p className="project-desc">
                {project.description || "No description provided"}
              </p>

              <p className="project-task-count">
                Tasks: {countTasks?.[project._id] || 0}
              </p>

              <div className="project-actions">
                <Link to={`/projects/${project._id}`} className="view-btn">
                  View
                </Link>

                <button
                  onClick={() => handleDeleteProject(project._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <CreateProject
          onClose={() => setIsModalOpen(false)}
          refreshProjects={fetchProjects}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
