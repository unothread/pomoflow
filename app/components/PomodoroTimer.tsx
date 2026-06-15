"use client";

import { useEffect, useReducer, useState } from "react";
import { createPortal } from "react-dom";
import { useLocalStorage } from "../lib/useLocalStorage";
import SettingsPanel from "./SettingsPanel";
import { useI18n } from "../lib/i18n";
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

// Map phase to translation key
const getPhaseLabel = (phase: Phase, t: (key: import("../lib/i18n").TranslationKey) => string) => {
  switch (phase) {
    case "idle": return t("idle");
    case "focus": return t("focus");
    case "shortBreak": return t("shortBreakLabel");
    case "longBreak": return t("longBreakLabel");
  }
}

// Colors now use CSS variables for theme support
const PHASE_COLORS: Record<Phase, string> = {
  idle: "bg-timer-idle-bg border-timer-idle-border text-timer-idle-text",
  focus: "bg-timer-focus-bg border-timer-focus-border text-timer-focus-text",
  shortBreak: "bg-timer-short-bg border-timer-short-border text-timer-short-text",
  longBreak: "bg-timer-long-bg border-timer-long-border text-timer-long-text",
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

function SettingsModal() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-colors focus:outline-none"
        aria-label={t("settingsBtn")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-md animate-in slide-in-from-bottom-4 zoom-in-95 duration-200">
            <SettingsPanel onClose={() => setIsOpen(false)} />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default function PomodoroTimer() {
  const { t } = useI18n();
  const [settings] = useLocalStorage<PomodoroSettings>(
    SETTINGS_KEY,
    DEFAULT_SETTINGS,
  );
  const [persistedCompleted, setPersistedCompleted] = useLocalStorage<number>(
    COMPLETED_KEY,
    0,
  );
  const [now, setNow] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [state, dispatch] = useReducer(reducer, {
    ...INITIAL,
    completedFocus: persistedCompleted,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

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
      const nowTime = Date.now();
      setNow(nowTime);
      if (
        state.phase !== "idle" &&
        state.endsAt !== null &&
        state.endsAt - nowTime <= 0
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
          endsAt: nowTime + sessionDurationMs(nextPhase, settings),
          running: settings.autoStart,
          newCompleted,
        });
        try {
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            new Notification(t("title"), {
              body: `${getPhaseLabel(state.phase, t)} → ${getPhaseLabel(nextPhase, t)}`,
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
      className={`p-4 sm:p-8 shadow-sm border transition-colors duration-500 flex flex-col h-auto ${PHASE_COLORS[state.phase]}`}
      style={{ borderRadius: 'var(--radius-card)', borderWidth: '1px' }}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4 relative shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest font-semibold opacity-60">
            {getPhaseLabel(state.phase, t)}
          </span>
          {state.phase !== "idle" && (
            <span className="text-[11px] uppercase tracking-widest font-semibold opacity-50">
              · {t("round")}{" "}
              {(state.completedFocus % settings.cyclesBeforeLongBreak) +
                (state.phase === "focus" ? 1 : 0)}
              /{settings.cyclesBeforeLongBreak}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-[11px] tracking-wide font-medium opacity-50 hidden sm:block">
            {settings.cyclesBeforeLongBreak} {t("cyclesInfo")}
          </div>
          
          <SettingsModal />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-0">
        <div className="flex items-baseline justify-center mb-4 sm:mb-6">
          <span className="text-6xl sm:text-8xl font-bold tabular-nums tracking-tighter opacity-90 transition-colors">
            {format(remainingMs)}
          </span>
        </div>

        <div className="h-1.5 w-full bg-foreground/10 overflow-hidden mb-6 sm:mb-8 shrink-0" style={{ borderRadius: 'var(--radius-button)' }}>
          <div
            className="h-full bg-foreground/30 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%`, borderRadius: 'var(--radius-button)' }}
          />
        </div>

        <div className="flex flex-wrap gap-2.5 justify-center shrink-0">
          {state.phase === "idle" ? (
            <>
              <button
                type="button"
                onClick={() => startSession("focus")}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-foreground hover:bg-foreground/90 text-background text-sm font-bold transition-colors"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                {t("startFocus")}
              </button>
              <button
                type="button"
                onClick={() => startSession("shortBreak")}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-foreground/10 hover:bg-foreground/20 text-foreground text-sm font-bold transition-colors"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                {t("startShortBreak")}
              </button>
              <button
                type="button"
                onClick={() => startSession("longBreak")}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-foreground/10 hover:bg-foreground/20 text-foreground text-sm font-bold transition-colors"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                {t("startLongBreak")}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={togglePause}
                className="px-5 sm:px-6 py-2 sm:py-2.5 bg-foreground hover:bg-foreground/90 text-background text-sm font-bold transition-colors min-w-28 sm:min-w-32"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                {state.running ? t("pause") : t("resume")}
              </button>
              <button
                type="button"
                onClick={skipPhase}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-foreground/10 hover:bg-foreground/20 text-foreground text-sm font-bold transition-colors"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                {t("skip")}
              </button>
              <button
                type="button"
                onClick={reset}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-foreground/10 hover:bg-foreground/20 text-foreground text-sm font-bold transition-colors"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                {t("reset")}
              </button>
            </>
          )}
          {isMounted && typeof Notification !== "undefined" &&
            Notification.permission === "default" && (
              <button
                type="button"
                onClick={requestNotifications}
                className="px-3 py-2 text-foreground/60 text-xs hover:text-foreground transition-colors font-bold"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                {t("enableNotifs")}
              </button>
            )}
        </div>
      </div>
    </section>
  );
}
