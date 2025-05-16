# 📋 Todoist — Task & Meeting Management App

A full-stack task and meeting management system designed with role-based access, file uploads, calendar scheduling, and more. Built with the MERN stack and deployed on Vercel.

---

## 🚀 Tech Stack

### 🔧 Backend

* **Framework:** [Express.js](https://expressjs.com/) — Minimalist Node.js web application framework.
* **Database:** [MongoDB](https://www.mongodb.com/) — NoSQL document database.
* **ODM:** [Mongoose](https://mongoosejs.com/) — Elegant MongoDB object modeling.
* **Authentication:**

  * [JWT](https://jwt.io/) — Stateless token-based authentication.
  * [bcryptjs](https://www.npmjs.com/package/bcryptjs) — Password hashing.
* **Email Service:** [Nodemailer](https://nodemailer.com/) — For password reset OTPs.
* **File Uploads:**

  * [Multer](https://www.npmjs.com/package/multer) — Middleware for handling multipart/form-data.
  * [Cloudinary](https://cloudinary.com/) + [multer-storage-cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary) — Cloud-based media storage.
* **Middleware:**

  * `cors` — Cross-Origin Resource Sharing.
  * `express.json()` — Parses incoming JSON requests.
* **Environment Management:** `dotenv`
* **Deployment:** [Vercel](https://vercel.com/)

---

### 🎨 Frontend

* **Framework:** [React](https://reactjs.org/)
* **Routing:** [React Router DOM](https://reactrouter.com/)
* **State Management:** React Hooks (`useState`, `useEffect`)
* **Styling:**

  * **CSS Modules** — Scoped component styles.
* **Calendar UI:** [React Big Calendar](https://github.com/jquense/react-big-calendar)
* **Date Utilities:** [date-fns](https://date-fns.org/)
* **Icons:** [react-icons](https://react-icons.github.io/react-icons/)
* **API Requests:** Fetch API
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Linting:** [ESLint](https://eslint.org/)
* **Deployment:** Vercel

---

## 🧠 Features & Implementation

### 🔐 Authentication Flow

* Sign up, login with JWT-based authentication.
* Passwords are securely hashed using bcrypt.
* Token stored in frontend (likely `localStorage`) for authenticated requests.

### 📌 Task Management

* Tasks have:

  * Title, description, due date
  * Priority, category, status
  * Assigned members, and attached documents
* Backend supports full CRUD with assignment logic.
* Frontend:

  * `TaskForm` component for task creation/editing
  * `TaskList` displays tasks with filtering and sorting

### 🗓️ Meeting Management

* Meetings include title, description, time, location, organizer, and attendees.
* Visualized in a calendar UI (`React Big Calendar`).
* `MeetingForm` component used for scheduling/editing.

### 👥 Member Management

* Fetches all users from backend.
* Used for displaying member lists and assigning tasks.

### 📁 File Uploads

* Users can attach documents to tasks.
* Files are uploaded using `FormData`, handled with `Multer`, and stored on Cloudinary.

### 🔑 Password Reset

* User can request OTP via email.
* Frontend component: `ForgotPassword`
* Backend verifies OTP and allows secure reset.

### 🧩 Component Structure

* Reusable React components such as:

  * `Header`, `Modal`, `TaskFilter`, `Intro`, etc.
* Pages managed using `App.jsx` with React Router routes.

---

## 📂 Folder Structure

```bash
├── backend
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── utils/
│   ├── server.js
│   └── vercel.json
├── frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── vercel.json
```

---

## 🛠️ Setup Instructions

### 🔙 Backend

```bash
cd backend
npm install
# Set your Mongo URI, JWT_SECRET, CLOUDINARY config in .env
npm start
```

### 🎨 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Live Demo

> Coming soon / Deployed on Vercel: [deplument link]([https://frontend-url.vercel.app](https://todoist-nsut.vercel.app/))
> Youtube Video [https://youtu.be/uMLT7Uvdm8w](https://youtu.be/uMLT7Uvdm8w)

---

## 🧑‍💻 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

---


---

