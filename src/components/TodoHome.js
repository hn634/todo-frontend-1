import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TaskFilter from "./TaskFilter";
import TaskList from "./TaskList";

function ToDoHome({ username }) {
  const [tasks, setTasks] = useState([]); // タスク一覧の状態
  const [title, setTitle] = useState(""); // 新しいタスクのタイトル
  const [details, setDetails] = useState(""); // 新しいタスクの詳細
  const [filter, setFilter] = useState("all"); // フィルター状態 ("all", "completed", "incomplete")
  const [error, setError] = useState(""); // エラーメッセージ
  const navigate = useNavigate(); // ページ遷移用フック

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000"; // バックエンドAPIのベースURL
  const token = localStorage.getItem("token"); // ログイン時に保存したトークンを取得

  /**
   * タスクの取得処理
   */
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
      });
      if (!response.ok) throw new Error("タスクの取得に失敗しました"); // エラーハンドリング
      const data = await response.json(); // JSON形式のデータを取得
      setTasks(data); // タスク一覧を更新
    } catch (err) {
      setError(err.message); // エラー内容を状態にセット
    }
  }, [API_BASE_URL, token]);

  /**
   * 初回レンダリング時にタスクを取得
   */
  useEffect(() => {
    fetchTasks(); // fetchTasks関数を呼び出し
  }, [fetchTasks]);

  /**
   * タスク追加処理
   */
  const handleAddTask = async (e) => {
    e.preventDefault(); // デフォルトのフォーム送信動作を防止
    if (!title || !details) {
      setError("タイトルと詳細を入力してください。"); // 入力チェック
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: "POST", // HTTPメソッド
        headers: {
          "Content-Type": "application/json", // JSON形式で送信
          Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
        },
        body: JSON.stringify({ title, details }), // タスクデータを送信
      });

      if (!response.ok) throw new Error("タスクの追加に失敗しました"); // エラーハンドリング
      const newTask = await response.json(); // 作成されたタスクを取得
      setTasks([...tasks, newTask]); // タスク一覧を更新
      setTitle(""); // 入力フィールドをリセット
      setDetails("");
      setError(""); // エラーメッセージをクリア
    } catch (err) {
      setError(err.message); // エラー内容を状態にセット
    }
  };

  /**
   * タスク削除処理
   */
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${taskId}`, {
        method: "DELETE", // HTTPメソッド
        headers: { Authorization: `Bearer ${token}` }, // トークンをヘッダーに追加
      });

      if (!response.ok) throw new Error("タスクの削除に失敗しました"); // エラーハンドリング
      setTasks(tasks.filter((task) => task.id !== taskId)); // 削除されたタスクを一覧から除外
    } catch (err) {
      setError(err.message); // エラー内容を状態にセット
    }
  };

  /**
   * タスク更新処理
   */
  const handleUpdateTask = async (taskId, updatedTitle, updatedDetails) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${taskId}`, {
        method: "PUT", // HTTPメソッド
        headers: {
          "Content-Type": "application/json", // JSON形式で送信
          Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
        },
        body: JSON.stringify({ title: updatedTitle, details: updatedDetails }), // 更新データを送信
      });

      if (!response.ok) throw new Error("タスクの更新に失敗しました"); // エラーハンドリング
      const updatedTask = await response.json(); // 更新後のタスクを取得
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task))); // タスク一覧を更新
    } catch (err) {
      setError(err.message); // エラー内容を状態にセット
    }
  };

  /**
   * タスク完了/未完了の切り替え処理
   */
  const handleToggleComplete = async (taskId, completed) => {
    try {
      const response = await fetch(`${API_BASE_URL}/todos/${taskId}/toggle`, {
        method: "PUT", // HTTPメソッド
        headers: {
          "Content-Type": "application/json", // JSON形式で送信
          Authorization: `Bearer ${token}`, // トークンをヘッダーに追加
        },
        body: JSON.stringify({ completed: !completed }), // 完了状態を切り替え
      });

      if (!response.ok) throw new Error("タスク状態の更新に失敗しました"); // エラーハンドリング
      const updatedTask = await response.json(); // 更新後のタスクを取得
      setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task))); // タスク一覧を更新
    } catch (err) {
      setError(err.message); // エラー内容を状態にセット
    }
  };

  /**
   * フィルタリング状態に応じたタスクリストを取得
   */
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed; // 完了タスクのみ
    if (filter === "incomplete") return !task.completed; // 未完了タスクのみ
    return true; // 全タスク
  });

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
  };

  const inputStyle = {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div style={{ width: "600px", margin: "0 auto", padding: "20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>{username} でログイン中</div>
        <button onClick={() => navigate("/login")} style={{ color: "red" }}>
          ログアウト
        </button>
      </header>

      {/* タスク追加フォーム */}
      <form style={formStyle} onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="タスクタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />
        <textarea
          placeholder="タスク詳細"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows="4"
          style={{ ...inputStyle, resize: "none" }}
        />
        <button
          type="submit"
          style={{ ...inputStyle, backgroundColor: "#28a745", color: "white" }}
        >
          タスクを追加
        </button>
      </form>

      {/* エラーメッセージ */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* タスクリストとフィルター */}
      <TaskFilter filter={filter} setFilter={setFilter} />
      <TaskList
        tasks={filteredTasks}
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateTask}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
}

export default ToDoHome;
