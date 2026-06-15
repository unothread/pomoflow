"use client";

import { useEffect, useReducer, useState } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";
import {
  DEFAULT_SETTINGS,
  type PomodoroSettings,
  type SessionKind,
} from "../lib/types";

type Phase = SessionKind | "idle";

const SETTINGS_KEY = "pomoflow.settings.v1";
const COMPLETED_KEY = "pomoflow.completedFocus.v1";

function format(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function sessionDurationMs(kind: SessionKind, settings: PomodoroSettings): number {
  switch (kind) {
    case "focus":
      return settings.focusMinutes * 60 * 1000;
    case "shortBreak":
      return settings.shortBreakMinutes * 60 * 1000;
    case "longBreak":
      return settings.longBreakMinutes * 60 * 1000;
  }
}

const PHASE_LABELS: Record<Phase, string> = {
  idle: "Hazır",
  focus: "Odak",
  shortBreak: "Kısa mola",
  longBreak: "Uzun mola",
};

const PHASE_COLORS: Record<Phase, string> = {
  idle: "from-zinc-200 to-zinc-100 text-zinc-700",
  focus: "from-rose-300 to-rose-100 text-rose-900",
  shortBreak: "from-emerald-300 to-emerald-100 text-emerald-900",
  longBreak: "from-sky-300 to-sky-100 text-sky-900",
};

type State = {
  phase: Phase;
  running: boolean;
  endsAt: number | null;
  completedFocus: number;
};

type Action =
  | { type: "start"; kind: SessionKind; endsAt: number }
  | { type: "pause" }
  | { type: "resume"; endsAt: number }
  | { type: "reset" }
  | { type: "skip"; nextPhase: SessionKind; endsAt: number }
  | {
      type: "advance";
      nextPhase: SessionKind;
      endsAt: number;
      running: boolean;
      newCompleted: number;
    };

const INITIAL: State = {
  phase: "idle",
  running: false,
  endsAt: null,
  completedFocus: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return {
        ...state,
        phase: action.kind,
        endsAt: action.endsAt,
        running: true,
      };
    case "pause":
      return { ...state, running: false };
    case "resume":
      return { ...state, endsAt: action.endsAt, running: true };
    case "reset":
      return { ...state, phase: "idle", running: false, endsAt: null };
    case "skip":
      return {
        ...state,
        phase: action.nextPhase,
        endsAt: action.endsAt,
        running: false,
      };
    case "advance":
      return {
        ...state,
        phase: action.nextPhase,
        endsAt: action.endsAt,
        running: action.running,
        completedFocus: action.newCompleted,
      };
  }
}

export default function PomodoroTimer() {
  const [settings] = useLocalStorage<PomodoroSettings>(
    SETTINGS_KEY,
    DEFAULT_SETTINGS,
  );
  const [persistedCompleted, setPersistedCompleted] = useLocalStorage<number>(
    COMPLETED_KEY,
    0,
  );
  const [now, setNow] = useState<number>(0);
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL,
    completedFocus: persistedCompleted,
  });

  // Push the latest completedFocus into persistent storage. The hook
  // handles writes; we just need to keep the persisted value aligned.
  useEffect(() => {
    if (state.completedFocus !== persistedCompleted) {
      setPersistedCompleted(state.completedFocus);
    }
  }, [state.completedFocus, persistedCompleted, setPersistedCompleted]);

  // Derived values (pure).
  const remainingMs =
    state.phase === "idle" || state.endsAt === null
      ? sessionDurationMs("focus", settings)
      : Math.max(0, state.endsAt - now);

  const totalMs =
    state.phase === "idle"
      ? sessionDurationMs("focus", settings)
      : sessionDurationMs(state.phase, settings);

  const progress = totalMs === 0 ? 0 : 1 - remainingMs / totalMs;

  // 250ms tick + auto-advance. Everything happens inside the interval
  // callback (an external event source) — we never setState inside an
  // effect body.
  useEffect(() => {
    if (!state.running) return;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (
        state.phase !== "idle" &&
        state.endsAt !== null &&
        state.endsAt - t <= 0
      ) {
        const newCompleted =
          state.phase === "focus" ? state.completedFocus + 1 : state.completedFocus;
        const nextPhase: SessionKind =
          state.phase === "focus"
            ? newCompleted % settings.cyclesBeforeLongBreak === 0
              ? "longBreak"
              : "shortBreak"
            : "focus";
        dispatch({
          type: "advance",
          nextPhase,
          endsAt: t + sessionDurationMs(nextPhase, settings),
          running: settings.autoStart,
          newCompleted,
        });
        try {
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            new Notification("Pomodoro", {
              body: `${PHASE_LABELS[state.phase]} bitti → ${PHASE_LABELS[nextPhase]}`,
            });
          }
        } catch {
          /* noop */
        }
      }
    };
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [
    state.running,
    state.phase,
    state.endsAt,
    state.completedFocus,
    settings,
  ]);

  // Pause when tab is hidden to avoid drift.
  useEffect(() => {
    function onVisibility() {
      if (document.hidden) dispatch({ type: "pause" });
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  function startSession(kind: SessionKind) {
    dispatch({
      type: "start",
      kind,
      endsAt: Date.now() + sessionDurationMs(kind, settings),
    });
  }

  function togglePause() {
    if (state.phase === "idle") return;
    if (state.running) {
      dispatch({ type: "pause" });
    } else {
      const remaining =
        state.endsAt === null
          ? sessionDurationMs(state.phase, settings)
          : Math.max(0, state.endsAt - Date.now());
      dispatch({ type: "resume", endsAt: Date.now() + remaining });
    }
  }

  function reset() {
    dispatch({ type: "reset" });
  }

  function skipPhase() {
    if (state.phase === "idle") return;
    const nextPhase: SessionKind =
      state.phase === "focus" ? "shortBreak" : "focus";
    dispatch({
      type: "skip",
      nextPhase,
      endsAt: Date.now() + sessionDurationMs(nextPhase, settings),
    });
  }

  async function requestNotifications() {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "default") {
      try {
        await Notification.requestPermission();
      } catch {
        /* noop */
      }
    }
  }

  return (
    <section
      className={`rounded-3xl p-6 sm:p-8 shadow-sm bg-gradient-to-br ${PHASE_COLORS[state.phase]}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-medium opacity-70">
            {PHASE_LABELS[state.phase]}
          </span>
          {state.phase !== "idle" && (
            <span className="text-xs opacity-60">
              · tur{" "}
              {(state.completedFocus % settings.cyclesBeforeLongBreak) +
                (state.phase === "focus" ? 1 : 0)}
              /{settings.cyclesBeforeLongBreak}
            </span>
          )}
        </div>
        <div className="text-xs opacity-60">
          {settings.cyclesBeforeLongBreak} kısa molada 1 uzun mola
        </div>
      </div>

      <div className="flex items-baseline justify-center my-4">
        <span className="font-mono text-7xl sm:text-8xl font-semibold tabular-nums tracking-tight">
          {format(remainingMs)}
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-white/50 overflow-hidden mb-6">
        <div
          className="h-full bg-current opacity-60 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {state.phase === "idle" ? (
          <>
            <button
              type="button"
              onClick={() => startSession("focus")}
              className="px-5 py-2.5 rounded-full bg-white/80 hover:bg-white text-zinc-900 text-sm font-medium shadow-sm"
            >
              Odaklanmayı başlat
            </button>
            <button
              type="button"
              onClick={() => startSession("shortBreak")}
              className="px-4 py-2.5 rounded-full bg-white/40 hover:bg-white/60 text-zinc-800 text-sm font-medium"
            >
              Kısa mola
            </button>
            <button
              type="button"
              onClick={() => startSession("longBreak")}
              className="px-4 py-2.5 rounded-full bg-white/40 hover:bg-white/60 text-zinc-800 text-sm font-medium"
            >
              Uzun mola
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={togglePause}
              className="px-6 py-2.5 rounded-full bg-white/80 hover:bg-white text-zinc-900 text-sm font-medium shadow-sm min-w-24"
            >
              {state.running ? "Duraklat" : "Devam et"}
            </button>
            <button
              type="button"
              onClick={skipPhase}
              className="px-4 py-2.5 rounded-full bg-white/40 hover:bg-white/60 text-zinc-800 text-sm font-medium"
            >
              Atla
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2.5 rounded-full bg-white/40 hover:bg-white/60 text-zinc-800 text-sm font-medium"
            >
              Sıfırla
            </button>
          </>
        )}
        {typeof Notification !== "undefined" &&
          Notification.permission === "default" && (
            <button
              type="button"
              onClick={requestNotifications}
              className="px-3 py-2.5 rounded-full text-zinc-700 text-xs underline-offset-2 hover:underline"
            >
              Bildirim aç
            </button>
          )}
      </div>
    </section>
  );
}
