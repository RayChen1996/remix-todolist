import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react"; 

export const meta: MetaFunction = () => {
  return [
    { title: "Todolist App by Remix" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
     <Outlet />
    </>
  );
}
