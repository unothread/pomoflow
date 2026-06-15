"use client";

import { useState, type FormEvent } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";
import type { Todo } from "../lib/types";

const TODO_KEY = "pomoflow.todos.v1";

export default function TodoList() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(TODO_KEY, []);
  const [text, setText] = useState("");

  const add = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        text: trimmed,
        done: false,
        createdAt: Date.now(),
      },
    ]);
    setText("");
  };

  const toggle = (id: string) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );

  const remove = (id: string) =>
    setTodos((prev) => prev.filter((t) => t.id !== id));

  const clearDone = () => setTodos((prev) => prev.filter((t) => !t.done));

  const remaining = todos.filter((t) => !t.done).length;
  const done = todos.length - remaining;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-900">Yapılacaklar</h2>
        <div className="text-xs text-zinc-500">
          {remaining} kaldı · {done} tamam
        </div>
      </header>

      <form onSubmit={add} className="flex gap-2 mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Yeni görev ekle…"
          className="flex-1 min-w-0 px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        <button
          type="submit"
          className="px-3 py-2 text-sm rounded-md bg-zinc-900 text-white hover:bg-zinc-700 disabled:opacity-40"
          disabled={!text.trim()}
        >
          Ekle
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="text-xs text-zinc-400 text-center py-6">
          Henüz görev yok. Odaklanma seansı için küçük adımlar ekleyebilirsin.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {todos.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-2 group px-1 py-1 rounded hover:bg-zinc-50"
            >
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggle(t.id)}
                className="w-4 h-4 accent-rose-500 shrink-0"
                aria-label={`Tamamlandı olarak işaretle: ${t.text}`}
              />
              <span
                className={`flex-1 text-sm ${
                  t.done ? "line-through text-zinc-400" : "text-zinc-800"
                }`}
              >
                {t.text}
              </span>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-zinc-400 hover:text-rose-500 text-sm px-1"
                aria-label={`Sil: ${t.text}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {done > 0 && (
        <div className="mt-3 pt-3 border-t border-zinc-100 flex justify-end">
          <button
            type="button"
            onClick={clearDone}
            className="text-xs text-zinc-500 hover:text-rose-500"
          >
            Tamamlananları temizle
          </button>
        </div>
      )}
    </section>
  );
}
