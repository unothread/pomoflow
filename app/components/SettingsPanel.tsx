"use client";

import { useLocalStorage } from "../lib/useLocalStorage";
import { DEFAULT_SETTINGS, type PomodoroSettings } from "../lib/types";

const SETTINGS_KEY = "pomoflow.settings.v1";

export default function SettingsPanel() {
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>(
    SETTINGS_KEY,
    DEFAULT_SETTINGS,
  );

  const update = <K extends keyof PomodoroSettings>(
    key: K,
    value: PomodoroSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
      <header className="mb-3">
        <h2 className="text-sm font-semibold text-zinc-900">Ayarlar</h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Değişiklikler otomatik kaydedilir.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <NumberField
          label="Odak süresi (dk)"
          value={settings.focusMinutes}
          min={1}
          max={180}
          onChange={(v) => update("focusMinutes", clamp(v, 1, 180))}
        />
        <NumberField
          label="Kısa mola (dk)"
          value={settings.shortBreakMinutes}
          min={1}
          max={60}
          onChange={(v) => update("shortBreakMinutes", clamp(v, 1, 60))}
        />
        <NumberField
          label="Uzun mola (dk)"
          value={settings.longBreakMinutes}
          min={1}
          max={120}
          onChange={(v) => update("longBreakMinutes", clamp(v, 1, 120))}
        />
        <NumberField
          label="Uzun moladan önceki kısa mola sayısı"
          value={settings.cyclesBeforeLongBreak}
          min={2}
          max={10}
          onChange={(v) => update("cyclesBeforeLongBreak", clamp(v, 2, 10))}
        />
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm text-zinc-700 select-none cursor-pointer">
        <input
          type="checkbox"
          checked={settings.autoStart}
          onChange={(e) => update("autoStart", e.target.checked)}
          className="w-4 h-4 accent-rose-500"
        />
        Seans bitince otomatik olarak sonrakini başlat
      </label>
    </section>
  );
}

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, Math.round(n)));
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-zinc-600 mb-1">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200"
      />
    </label>
  );
}
