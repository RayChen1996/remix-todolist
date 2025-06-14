"use client";
import { useAuthStore } from "~/store/auth";

import { Controller, FormProvider, useForm } from "react-hook-form";
import { resolver, defaultValues, SchemaType } from "./../forms/signIn";
import { toast } from "react-toastify";
import { useNavigate } from "@remix-run/react";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Todo App - 登入" },
    {
      name: "description",
      content: "Remix Todo App 的登入頁面，請輸入您的帳號和密碼。",
    },
  ];
};
/** - 登入頁 */
export default function LoginPage() {
  const setToken = useAuthStore((s) => s.setToken);
  const setNickName = useAuthStore((s) => s.setNickName);
  const setUserEmail = useAuthStore((s) => s.setUserEmail);
  const setExp = useAuthStore((s) => s.setExp);
  const form = useForm<SchemaType>({
    resolver,
    defaultValues,
    mode: "onBlur",
  });

  const { handleSubmit } = form;
  const navigate = useNavigate();

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const res = await fetch("https://todolist-api.hexschool.io/users/sign_in", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email: "", password: "" }), // 這裡應該從表單獲取 email 和 password
  //   });
  //   const data = await res.json();
  //   if (data.token) {
  //     setToken(data.token);
  //     alert("登入成功");
  //   } else {
  //     alert("登入失敗：" + data.message);
  //   }
  // };

  const onSubmit = async (data: SchemaType) => {
    const res = await fetch("https://todolist-api.hexschool.io/users/sign_in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.token) {
      console.log("登入成功", result);
      setToken(result.token);
      setNickName(result.nickname);
      setUserEmail(result.email);
      setExp(result.exp);

      // alert("登入成功");
      toast.success("登入成功", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/todos");
    } else {
      alert("登入失敗：" + result.message);
    }
  };

  return (
    <FormProvider {...form}>
      <div className="max-w-sm mx-auto mt-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card bg-base-100 shadow-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">登入</h2>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState: { error } }) => (
              <>
                <input
                  type="text"
                  placeholder="Email"
                  className="input input-bordered w-full mb-2"
                  {...field}
                />
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <>
                <input
                  type="password"
                  placeholder="密碼"
                  className="input input-bordered w-full mb-4"
                  {...field}
                />
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </>
            )}
          />

          <button className="btn btn-primary w-full" type="submit">
            登入
          </button>
        </form>
      </div>
    </FormProvider>
  );
}
