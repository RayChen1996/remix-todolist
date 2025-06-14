"use client";
import { Link, useNavigate } from "@remix-run/react";
import { useAuthStore } from "~/store/auth";
import { Menu } from "lucide-react";

export default function AppHeader() {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);
  const nickName = useAuthStore((s) => s.nickName);
  // const userEmail = useAuthStore((s) => s.userEmail);
  const clearAuth = useAuthStore((s) => s.clear);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  // return (
  //   <header className="navbar bg-base-100 shadow-sm ">
  //     <div className="container mx-auto">
  //       <div className=" navbar-start">

  //       </div>
  //       <div className="navbar-center"></div>
  //       <div className="navbar-end">
  //         <ul className="menu menu-horizontal p-0 space-x-2">
  //           <li>
  //             <Link to="/">首頁</Link>
  //           </li>
  //           {token && (
  //             <>
  //               <li>
  //                 <Link to="/todos">{nickName} 待辦事項</Link>
  //               </li>
  //               <li>
  //                 <Link to="/favorites">{nickName} 的收藏</Link>
  //               </li>
  //             </>
  //           )}

  //           {!token ? (
  //             <>
  //               <li>
  //                 <Link to="/login">登入</Link>
  //               </li>
  //               <li>
  //                 <Link to="/register">註冊</Link>
  //               </li>
  //             </>
  //           ) : (
  //             <>
  //               <li>
  //                 <span className="text-sm">👤 {userEmail}</span>
  //               </li>
  //               <li>
  //                 <button
  //                   onClick={handleLogout}
  //                   className="btn btn-error btn-sm text-white"
  //                 >
  //                   登出
  //                 </button>
  //               </li>
  //             </>
  //           )}
  //         </ul>
  //       </div>
  //     </div>
  //   </header>
  // );
  return (
    <div>
      <header className="navbar bg-base-100 shadow-sm justify-between">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            Remix Todo App
          </Link>
        </div>

        <div className="navbar-end hidden lg:block text-right">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/">首頁</Link>
            </li>

            {token ? (
              <>
                <li>
                  <Link to="/todos">{nickName} 的待辦事項</Link>
                </li>
                <li>
                  <Link to="/favorites">{nickName} 的收藏</Link>
                </li>
                <li>
                  <span className="text-sm">👤 {nickName}</span>
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
            ) : (
              <ul className="bg-base-100 rounded-t-none p-2">
                <li>
                  <Link to="/login">登入</Link>
                </li>
                <li>
                  <Link to="/register">註冊</Link>
                </li>
              </ul>
            )}
            {/* <ul className="bg-base-100 rounded-t-none p-2">
                <li>
                  <Link to="/todos">待辦事項</Link>
                </li>
                <li>
                  <Link to="/favorites">我的收藏</Link>
                </li>
              </ul> */}
          </ul>
        </div>
        <div className="navbar-end lg:hidden ">
          <label
            htmlFor="my-drawer-2"
            aria-label="open sidebar"
            className="btn btn-ghost lg:hidden"
          >
            {/* <span className="sr-only">Open navigation menu</span> */}
            <Menu className="h-6 w-6" />
          </label>
        </div>
      </header>

      <div className="drawer">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              <Link to="/">首頁</Link>
            </li>
            {token ? (
              <>
                <li>
                  <Link to="/todos">{nickName} 的待辦事項</Link>
                </li>
                <li>
                  <Link to="/favorites">{nickName} 的收藏</Link>
                </li>
                <li>
                  <span className="text-sm">👤 {nickName}</span>
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
            ) : (
              <>
                <li>
                  <Link to="/login">登入</Link>
                </li>
                <li>
                  <Link to="/register">註冊</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
