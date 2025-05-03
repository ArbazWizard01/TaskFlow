# 📝 TaskFlow

TaskFlow is a full-stack task management application that allows users to create and manage projects, add tasks to each project, and track progress efficiently. Designed for simplicity and productivity, it provides a clear interface and robust backend functionality.

## 🚀 Features

* 🔐 User Authentication (JWT-based)
* 📁 Project Management (Create, Read)
* ✅ Task CRUD (Create, Read, Update, Delete)
* 🗕️ Track task status (`pending`, `in progress`, `completed`)
* 📅 Auto-updated `completedAt` timestamp when a task is marked as completed
* 💽 Responsive and user-friendly interface
* 📦 Modal-based inline editing for tasks
* 🔒 Route protection and user-specific data handling

---

## 💠 Tech Stack

### Frontend

* React
* React Router
* Axios
* Context API (for auth)
* Custom CSS (with modal UI)

### Backend

* Node.js
* Express.js
* MongoDB (Native Driver)
* JWT Authentication
* Bcrypt for password hashing

---

## 📂 Project Structure

```
taskflow/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   └── db.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── services/api.js
│   │   └── contexts/AuthContext.js
│   └── public/
```

---

## 🧪 API Endpoints

### Auth

* `POST /auth/register` - Register user
* `POST /auth/login` - Login user and receive JWT

### Projects

* `POST /projects` - Create a project
* `GET /projects` - Get all user projects
* `GET /projects/:id` - Get a specific project (with validation)

### Tasks

* `GET /tasks/:projectId` - Get tasks for a project
* `POST /tasks/:projectId` - Add a task to a project
* `PATCH /tasks/:taskId` - Update a task
* `DELETE /tasks/:taskId` - Delete a task

---

## 🧑‍💻 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run dev
```

Make sure to configure your MongoDB URI and JWT secret in a `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_jwt_secret
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🔐 Authentication

JWT tokens are issued upon login and stored in localStorage. The token is sent in headers for all protected routes.

---

## 📸 Screenshots

![WhatsApp Image 2025-05-03 at 17 46 33_ba85303d](https://github.com/user-attachments/assets/097cef1a-dd12-4787-970b-328a6828c778)

![WhatsApp Image 2025-05-03 at 17 46 45_898e2ee5](https://github.com/user-attachments/assets/a63fbb43-17c7-4b07-bcf4-ebd7578a21d8)

---

## 🤝 Contributing

PRs are welcome! If you find bugs or want to suggest features, feel free to open issues.

---

## 📄 License

MIT License © 2025 [Arbaz](https://github.com/ArbazWizard01)
