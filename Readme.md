# 💬 Chat App with Ollama, PostgreSQL, Node.js & React

A full-stack AI chatbot app using Ollama for local model generation, PostgreSQL for persistent chat/message storage, Express.js for backend APIs, and a modern Vite + React frontend.

---

## 🧰 Tech Stack

### 🖥️ Frontend:
- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Vite](https://vitejs.dev/)

### 🖥️ Backend:
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL 17](https://www.postgresql.org/)
- [Ollama](https://ollama.com) – Local Large Language Model runner

---

## 🛠️ Setup Instructions

### 🔹 1. Install Required Software

| Software       | Download Link                              | Notes                                 |
|----------------|---------------------------------------------|----------------------------------------|
| Node.js        | https://nodejs.org/en/download              | Use LTS version                       |
| PostgreSQL 17  | https://www.postgresql.org/download/        | Include pgAdmin for easier DB access |
| Ollama         | https://ollama.com                          | Required to run LLM locally           |
| Git (optional) | https://git-scm.com/downloads               | For cloning repository                |

---

### 🔹 2. Clone the Repository

```bash```
git clone https://your-repo-url
cd your-project-folder

### 🔹 3. Backend Setup

#### 📁 Navigate to the backend directory:

```bash```
    cd backend
    npm i or npm install
    npm start / node index.js


### 🔹 4. Ollama Setup

#### ✅ Install Ollama

Download and install Ollama from the official website:

👉 https://ollama.com

#### 🧠 Pull a model

You need to pull at least one model to use in your app. Recommended models:

```bash
ollama pull gemma3:1b

ollama serve
# or
ollama run gemma3:1b

API enpoint : http://localhost:11434/


### 🔹 5. Frontend Setup

#### 📁 Navigate to the frontend directory:

```bash
cd ../frontend
#Install frontend dependencies
npm install
#Start the Vite development server:
npm run dev

#The frontend will start on: 
http://localhost:5173

### 🔹 How to Run SQL Queries in PostgreSQL

You can create tables and run queries in PostgreSQL using one of the following methods:

---

#### 🛠 Option 1: Using `psql` (PostgreSQL CLI)

1. Open your terminal
2. Connect to your database:

```bash
psql -U your_db_user -d your_database_name #Replace your_db_user and your_database_name with your actual credentials.

CREATE TABLE chats (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  chat_id INTEGER NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
##Make sure your connection.js file contains your PostgreSQL credentials:
#Replace your_db_user, your_database_name, and your_password with your actual values.
const pool = new Pool({
  user: 'your_db_user',
  host: 'localhost',
  database: 'your_database_name',
  password: 'your_password',
  port: 5432,
});
