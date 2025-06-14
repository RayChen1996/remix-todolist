"use client";

import { useNavigate } from "@remix-run/react";
import { useAuthStore } from "~/store/auth";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { resolver, defaultValues, SchemaType } from "../forms/signUp";
import { MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = () => {
  return [
    { title: "註冊 | Remix Todo App" },
    {
      name: "description",
      content: "Remix Todo App 的註冊頁面，請輸入您的帳號、密碼和暱稱。",
    },
  ];
};
/** - 註冊頁 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  const forms = useForm<SchemaType>({
    resolver,
    defaultValues,
    mode: "onBlur",
  });

  const { handleSubmit } = forms;

  // const handleRegister = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const res = await fetch("https://todolist-api.hexschool.io/users/sign_up", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email: "", password: "" }),
  //   });

  //   const data = await res.json();

  //   if (data.status) {
  //     // 註冊成功後自動登入
  //     const loginRes = await fetch(
  //       "https://todolist-api.hexschool.io/users/sign_in",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email: "", password: "" }),
  //       },
  //     );
  //     const loginData = await loginRes.json();
  //     if (loginData.token) {
  //       setToken(loginData.token);
  //       alert("註冊並登入成功！");
  //       navigate("/todos");
  //     } else {
  //       alert("登入失敗：" + loginData.message);
  //     }
  //   } else {
  //     alert("註冊失敗：" + data.message);
  //   }
  // };

  const onSubmit = async (data: SchemaType) => {
    const res = await fetch("https://todolist-api.hexschool.io/users/sign_up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.status) {
      // 註冊成功後自動登入
      const loginRes = await fetch(
        "https://todolist-api.hexschool.io/users/sign_in",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        },
      );
      const loginData = await loginRes.json();
      if (loginData.token) {
        setToken(loginData.token);
        alert("註冊並登入成功！");
        navigate("/todos");
      } else {
        alert("登入失敗：" + loginData.message);
      }
    } else {
      alert("註冊失敗：" + result.message);
    }
  };
  return (
    <FormProvider {...forms}>
      <div className="max-w-sm mx-auto mt-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="card bg-base-100 shadow-xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">註冊帳號</h2>
          <Controller
            control={forms.control}
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
            control={forms.control}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <>
                <input
                  type="password"
                  placeholder="密碼（6 字以上）"
                  className="input input-bordered w-full mb-4"
                  {...field}
                />
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </>
            )}
          />
          <Controller
            control={forms.control}
            name="nickname"
            render={({ field, fieldState: { error } }) => (
              <>
                <input
                  type="text"
                  placeholder="暱稱"
                  className="input input-bordered w-full mb-4"
                  {...field}
                />
                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
              </>
            )}
          />
          {/* <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /> */}
          {/* <input
            type="password"
            placeholder="密碼（6 字以上）"
            className="input input-bordered w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /> */}
          <button className="btn btn-primary w-full" type="submit">
            註冊
          </button>
        </form>
      </div>
    </FormProvider>
  );
}
