export type SessionKind = "focus" | "shortBreak" | "longBreak";

/** Selectable alarm sound ids. Keep in sync with ALARM_SOUNDS in alarms.ts. */
export type AlarmId = "alarm1" | "alarm2" | "alarm3" | "alarm4" | "alarm5";

export type PomodoroSettings = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  /** Number of completed focus sessions before a long break. */
  cyclesBeforeLongBreak: number;
  /** Auto-start the next session when the current one ends. */
  autoStart: boolean;
  /** Alarm sound played when a session ends. */
  alarmSound: AlarmId;
};

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesBeforeLongBreak: 4,
  autoStart: false,
  alarmSound: "alarm1",
};

export type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
};
