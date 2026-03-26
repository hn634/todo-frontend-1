import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import SignUpForm from "./components/SignUpForm";
import ToDoForm from "./components/ToDoForm";
import ToDoList from "./components/ToDoList";

function App() {
  const [todos, setTodos] = useState([]);

  // 🔥 スタイル（そのまま使う）
  const appStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    boxSizing: "border-box",
  };

  // 🔥 API取得
  useEffect(() => {
    fetch("http://localhost:8000/api/todo")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // 🔥 追加処理
  const addTodo = (text) => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), title: text }]);
  };

  return (
    <div style={appStyle}>
      <Header />

      {/* 👇 サインアップ */}
      <SignUpForm />

      {/* 👇 Todo機能 */}
      <ToDoForm addTodo={addTodo} />
      <ToDoList todos={todos} />
    </div>
  );
}

export default App;
