import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import ToDoForm from "./components/ToDoForm";
import ToDoList from "./components/ToDoList";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // http://localhost:8000/api/todoにアクセスし、todoのリストを取得
    fetch("http://localhost:8000/api/todo")
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const addTodo = (text) => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), title: text }]);
  };

  return (
    <div>
      <Header />
      <ToDoForm addTodo={addTodo} />
      <ToDoList todos={todos} />
    </div>
  );
}

export default App;
