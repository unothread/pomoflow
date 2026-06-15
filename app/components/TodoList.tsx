"use client";

import { useState, type FormEvent } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";
import type { Todo } from "../lib/types";
import { useI18n } from "../lib/i18n";

const TODO_KEY = "pomoflow.todos.v1";

export default function TodoList() {
  const { t } = useI18n();
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

  // Display order only: completed items sink to the bottom. Stable sort keeps
  // each group in its original (storage) order, so toggling preserves place.
  const ordered = [...todos].sort((a, b) => Number(a.done) - Number(b.done));

  return (
    <section className="bg-card border-card-border p-4 sm:p-8 shadow-sm h-full flex flex-col overflow-hidden transition-colors duration-500" style={{ borderRadius: 'var(--radius-card)', borderWidth: '1px' }}>
      <header className="flex items-center justify-between mb-2 sm:mb-4 shrink-0">
        <h2 className="text-base font-semibold text-foreground tracking-tight">{t("todos")}</h2>
        <div className="text-xs font-medium text-muted-foreground bg-background/50 border border-card-border px-2.5 py-1" style={{ borderRadius: 'var(--radius-button)' }}>
          {remaining} {t("left")} · {done} {t("doneLabel")}
        </div>
      </header>

      <form onSubmit={add} className="flex gap-2 mb-2 sm:mb-4 shrink-0">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("addTodo")}
          className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 text-sm border border-card-border bg-background/50 hover:bg-background focus:outline-none focus:border-accent transition-colors text-foreground"
          style={{ borderRadius: 'var(--radius-button)' }}
        />
        <button
          type="submit"
          className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium bg-foreground text-background hover:bg-foreground/80 transition-colors disabled:opacity-40 disabled:hover:bg-foreground"
          style={{ borderRadius: 'var(--radius-button)' }}
          disabled={!text.trim()}
        >
          {t("add")}
        </button>
      </form>

      <div className="flex-1 overflow-y-auto min-h-0 max-h-[55vh] lg:max-h-none -mx-2 px-2 custom-scrollbar">
        {todos.length === 0 ? (
          <div className="py-6 text-center h-full flex flex-col justify-center items-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-background border border-card-border mb-3" style={{ borderRadius: 'var(--radius-button)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <p className="text-sm text-muted">
              {t("emptyTodo")}
            </p>
          </div>
        ) : (
          <ul className="space-y-1 pb-2">
            {ordered.map((tItem) => (
              <li
                key={tItem.id}
                className="flex items-center gap-3 group px-3 py-2.5 hover:bg-background/50 transition-colors"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                <input
                  type="checkbox"
                  checked={tItem.done}
                  onChange={() => toggle(tItem.id)}
                  className="w-5 h-5 cursor-pointer"
                  style={{ accentColor: 'var(--color-accent)' }}
                  aria-label={`${t("doneLabel")}: ${tItem.text}`}
                />
                <span
                  className={`flex-1 text-sm transition-colors ${
                    tItem.done ? "line-through text-muted" : "text-foreground"
                  }`}
                >
                  {tItem.text}
                </span>
                <button
                  type="button"
                  onClick={() => remove(tItem.id)}
                  className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted hover:text-accent text-sm p-1 hover:bg-card-border transition-all"
                  style={{ borderRadius: 'calc(var(--radius-button) - 4px)' }}
                  aria-label={`${t("delete")}: ${tItem.text}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {done > 0 && (
        <div className="mt-2 pt-2 sm:mt-4 sm:pt-4 border-t border-card-border/50 flex justify-end shrink-0">
          <button
            type="button"
            onClick={clearDone}
            className="text-xs font-medium text-muted hover:text-foreground transition-colors"
          >
            {t("clearDone")}
          </button>
        </div>
      )}
    </section>
  );
}
