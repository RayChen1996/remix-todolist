import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import AppHeader from "./components/Layouts/AppHeader";
// import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthStore } from "./store/auth";
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const { clear, exp } = useAuthStore();
  exp && exp < Date.now() / 1000 && clear(); // 清除過期的 token
  return (
    <div className=" flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>

        <ToastContainer position="top-center" autoClose={3000} />
      </main>
    </div>
  );
}
