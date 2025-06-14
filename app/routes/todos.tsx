"use client";
import { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "@remix-run/react";
import { useAuthStore } from "~/store/auth";
import { useWishListStore } from "~/store/wishlist";
import { Todo } from "~/schema/Todo";
import { useMutation } from "@tanstack/react-query";

const todosCounts = Array(10).fill(undefined);

/** - 列表頁 */
export default function TodosPage() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  // const { add, clear } = useWishListStore();
  // const wishList = useWishListStore((s) => s.wishList);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true); // 加上這一行

  // 取得 todos 資料
  const fetchTodos = useCallback(async () => {
    const res = await fetch("https://todolist-api.hexschool.io/todos", {
      headers: {
        Authorization: token,
      },
    });
    const data = await res.json();
    setTodos(data.data);
  }, [token]);

  // 登入狀態檢查 + 初始化
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchTodos().finally(() => {
      setLoading(false); // 資料讀完才顯示畫面
    });
  }, [token, navigate, fetchTodos]);

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
          onKeyDown={(e) => {
            if (
              (e.key === "Enter" && newTodo.trim()) ||
              e.key === "NumpadEnter"
            ) {
              addTodo();
            }
          }}
        />

        <button className="btn btn-primary" onClick={addTodo}>
          新增
        </button>
      </div>

      {loading ? (
        todosCounts.map((_, index) => (
          <div key={index} className="skeleton w-full h-10 mb-2"></div>
        ))
      ) : todos.length > 0 ? (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} refetchTodos={fetchTodos} />
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500">
          <p>目前沒有待辦事項</p>
          <p>快來新增你的第一個待辦吧！</p>
        </div>
      )}
    </div>
  );
}

type TodoItemProps = {
  todo: Todo;
  refetchTodos?: () => void;
};

const TodoItem = memo(function TodoItem({ todo, refetchTodos }: TodoItemProps) {
  const token = useAuthStore((s) => s.token);

  // const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`https://todolist-api.hexschool.io/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["todos"] });
      refetchTodos?.();
    },
  });

  const deleteTodo = async (id: string) => {
    await mutate(id);
  };
  const fetchTodos = async () => {
    refetchTodos?.();
  };

  const { mutate: toggleMutate, isPending: isTogglePending } = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`https://todolist-api.hexschool.io/todos/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: token,
        },
      });
    },
    onSuccess: () => {
      fetchTodos();
    },
  });

  const toggleTodo = async (id: string) => {
    await toggleMutate(id);
  };

  const handleDelete = async () => {
    await deleteTodo(todo.id);
  };

  const handleToggle = async () => {
    await toggleTodo(todo.id);
  };

  return (
    <li className="flex items-center justify-between p-4 border rounded">
      <label className="flex items-center cursor-pointer">
        {isTogglePending ? (
          <span className="loading loading-spinner mr-2"></span>
        ) : (
          <input
            type="checkbox"
            checked={todo.status}
            onChange={handleToggle}
            className="mr-2 checkbox checkbox-primary"
          />
        )}

        <span className={todo.status ? "line-through text-gray-400" : ""}>
          {todo.content}
        </span>
      </label>
      <div className="flex items-center gap-2">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            const wishItem = {
              id: todo.id,
              createTime: Date.now(),
              content: todo.content,
              status: todo.status,
            };
            useWishListStore.getState().add(wishItem);
          }}
        >
          收藏
        </button>
        <button className="btn btn-error btn-sm" onClick={handleDelete}>
          刪除
          {isPending && <span className="loading loading-spinner"></span>}
        </button>
      </div>
    </li>
  );
});
