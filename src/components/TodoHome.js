import React, { useState } from "react";

function ToDoHome({ onLogout, username }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();

    if (title.trim().length === 0 || title.trim().length > 25) {
      setError("タイトルは1文字以上、25文字以内で入力してください。");
      return;
    }

    if (details.trim().length === 0) {
      setError("詳細を入力してください。");
      return;
    }

    setError("");

    const currentDateTime = new Date().toLocaleString();

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      details: details.trim(),
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
    };

    setTasks([...tasks, newTask]);
    setTitle("");
    setDetails("");

    setNotification("タスクが追加されました！");
    setTimeout(() => setNotification(""), 3000);
  };

  const handleLogout = () => {
    setTasks([]);
    onLogout();
  };

  const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  };

  const logoutButtonStyle = {
    padding: "10px",
    fontSize: "14px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
  };

  const submitButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  };

  const taskItemStyle = {
    borderBottom: "1px solid #ddd",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    backgroundColor: "#f8f9fa",
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>{username}でログイン中</div>
        <button style={logoutButtonStyle} onClick={handleLogout}>
          ログアウト
        </button>
      </header>

      <h2>ようこそ！ToDoアプリへ</h2>

      <form onSubmit={handleAddTask} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="タスクタイトル（25文字以内）"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="タスク詳細"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows="4"
          style={inputStyle}
        />

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

        <button type="submit" style={submitButtonStyle}>
          追加
        </button>
      </form>

      {notification && (
        <p style={{ color: "green", marginBottom: "20px" }}>{notification}</p>
      )}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={taskItemStyle}>
            <h3 style={{ margin: "0 0 5px 0" }}>{task.title}</h3>
            <p style={{ margin: "0 0 5px 0" }}>{task.details}</p>
            <small style={{ display: "block", color: "#888" }}>
              作成日時: {task.createdAt}
            </small>
            <small style={{ display: "block", color: "#888" }}>
              更新日時: {task.updatedAt}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoHome;
