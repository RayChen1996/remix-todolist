"use client"

import type React from "react"

import { useCallback, useEffect, useState } from "react"
import type { Todo } from "~/schema/Todo"
import { useAuthStore } from "~/store/auth"

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">儀錶板</h1>
      <p className="mb-6">歡迎來到 Remix Todo App！</p>

      <TodoCountdownTable />
    </div>
  )
}

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function TodoCountdownTable() {
  const token = useAuthStore((s) => s.token)
  const [todos, setTodos] = useState<Todo[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch("https://todolist-api.hexschool.io/todos", {
        headers: {
          Authorization: token,
        },
      })
      const data = await res.json()
      setTodos(data.data)
    } catch (error) {
      console.error("Failed to fetch todos:", error)
    }
  }, [token])

  // 更新當前時間，每秒執行一次
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  // 過濾未完成的待辦事項並按創建時間排序
  const incompleteTodos = todos
    .filter((todo) => !todo.status && todo.createTime)
    .sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime())

  // 計算倒數時間 - 修改為每天凌晨12點前才顯示過期
  const calculateTimeLeft = (createTime: string): CountdownTime | null => {
    const createDate = new Date(createTime)

    // 設定截止時間為創建日期當天的23:59:59
    const dueDate = new Date(createDate)
    dueDate.setHours(23, 59, 59, 999)

    const timeLeft = dueDate.getTime() - currentTime.getTime()

    if (timeLeft <= 0) {
      return null // 已過期（過了當天凌晨12點）
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  if (incompleteTodos.length === 0) {
    return (
      <div className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>目前沒有未完成的待辦事項。</span>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">未完成待辦事項倒數</h2>
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>待辦事項</th>
            <th>創建時間</th>
            <th>倒數時間</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          {incompleteTodos.map((todo) => {
            const timeLeft = calculateTimeLeft(new Date(todo.createTime).toISOString())
            const dueDate = new Date(todo.createTime)

            return (
              <tr key={todo.id}>
                <td>
                  <div className="font-medium">{todo.content}</div>
                </td>
                <td>
                  <div className="text-sm opacity-70">
                    創建：{dueDate.toLocaleDateString("zh-TW")}
                    <br />
                    <span className="text-xs">截止：當天 23:59</span>
                  </div>
                </td>
                <td>
                  {timeLeft ? (
                    <div className="countdown font-mono text-2xl">
                      <span style={{ "--value": timeLeft.days } as React.CSSProperties}></span>天
                      <span style={{ "--value": timeLeft.hours } as React.CSSProperties}></span>時
                      <span style={{ "--value": timeLeft.minutes } as React.CSSProperties}></span>分
                      <span style={{ "--value": timeLeft.seconds } as React.CSSProperties}></span>秒
                    </div>
                  ) : (
                    <div className="badge badge-error">已過期</div>
                  )}
                </td>
                <td>
                  {timeLeft ? (
                    <div className="badge badge-warning">進行中</div>
                  ) : (
                    <div className="badge badge-error">過期</div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
