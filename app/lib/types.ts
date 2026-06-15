export type SessionKind = "focus" | "shortBreak" | "longBreak";

export type PomodoroSettings = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  /** Number of completed focus sessions before a long break. */
  cyclesBeforeLongBreak: number;
  /** Auto-start the next session when the current one ends. */
  autoStart: boolean;
};

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
  autoStart: false,
};

export type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};
