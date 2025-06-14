import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { useAuthStore } from "~/store/auth";

interface Todo {
  id: string;
  content: string;
  completed_at: string | null;
}

export default function TodosPage() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true); // 加上這一行

  // 取得 todos 資料
  const fetchTodos = async () => {
    const res = await fetch("https://todolist-api.hexschool.io/todos", {
      headers: {
        Authorization: token,
      },
    });
    const data = await res.json();
    setTodos(data.data);
  };

  // 登入狀態檢查 + 初始化
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchTodos().finally(() => {
      setLoading(false); // 資料讀完才顯示畫面
    });
  }, [token, navigate]);

  if (loading) {
    return <div className="text-center mt-10">載入中...</div>;
  }

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    await fetch("https://todolist-api.hexschool.io/todos", {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newTodo }),
    });
    setNewTodo("");
    fetchTodos();
  };

  const deleteTodo = async (id: string) => {
    await fetch(`https://todolist-api.hexschool.io/todos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });
    fetchTodos();
  };

  const toggleTodo = async (id: string) => {
    await fetch(`https://todolist-api.hexschool.io/todos/${id}/toggle`, {
      method: "PATCH",
      headers: {
        Authorization: token,
      },
    });
    fetchTodos();
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">待辦清單</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="輸入待辦事項"
          className="input input-bordered w-full"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addTodo}>
          新增
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-3 rounded bg-base-200"
          >
            <button
              type="button"
              className={`flex-1 text-left bg-transparent border-none p-0 cursor-pointer ${
                todo.completed_at ? "line-through text-gray-400" : ""
              }`}
              onClick={() => toggleTodo(todo.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleTodo(todo.id);
                }
              }}
              tabIndex={0}
              aria-pressed={!!todo.completed_at}
            >
              {todo.content}
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="btn btn-sm btn-error"
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
