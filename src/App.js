import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import ToDoForm from "./components/ToDoForm";
import ToDoList from "./components/ToDoList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [todos, setTodos] = useState([]);

  const appStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
  };

  // 🔥 API取得（ログイン後だけでもOK）
  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://localhost:8000/api/todo")
        .then((res) => res.json())
        .then((data) => setTodos(data))
        .catch((err) => console.error(err));
    }
  }, [isLoggedIn]);

  // 🔥 ログイン
  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  // 🔥 ログアウト
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setTodos([]);
  };

  // 🔥 Todo追加
  const addTodo = (text) => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), title: text }]);
  };

  return (
    <Router>
      <div style={appStyle}>
        <Header />

        <Routes>
          {/* ログイン */}
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />

          {/* サインアップ */}
          <Route path="/signup" element={<SignUpForm />} />

          {/* 🔥 Todo画面 */}
          <Route
            path="/home"
            element={
              isLoggedIn ? (
                <div>
                  <p>ようこそ {username} 👋</p>
                  <button onClick={handleLogout}>ログアウト</button>

                  <ToDoForm addTodo={addTodo} />
                  <ToDoList todos={todos} />
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* デフォルト */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
