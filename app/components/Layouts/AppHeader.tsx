"use client";
import { Link, useNavigate } from "@remix-run/react";
import { useAuthStore } from "~/store/auth";

export default function AppHeader() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const userEmail = useAuthStore((s) => s.userEmail);
  const clearAuth = useAuthStore((s) => s.clear);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="navbar bg-base-100 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Remix Todo App
        </Link>

        <ul className="menu menu-horizontal p-0 space-x-2">
          <li>
            <Link to="/">首頁</Link>
          </li>
          {token && (
            <>
              <li>
                <Link to="/todos">待辦事項</Link>
              </li>
              <li>
                <Link to="/favorites">我的收藏</Link>
              </li>
            </>
          )}

          {!token ? (
            <>
              <li>
                <Link to="/login">登入</Link>
              </li>
              <li>
                <Link to="/register">註冊</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <span className="text-sm">👤 {userEmail}</span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-error btn-sm text-white"
                >
                  登出
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
