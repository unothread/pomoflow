"use client";

import { useLocalStorage } from "../lib/useLocalStorage";
import { DEFAULT_SETTINGS, type PomodoroSettings } from "../lib/types";
import { useI18n } from "../lib/i18n";

const SETTINGS_KEY = "pomoflow.settings.v1";

interface SettingsPanelProps {
  onClose?: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { t } = useI18n();
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
    <div className="bg-background border-card-border p-6 sm:p-8 shadow-xl relative" style={{ borderRadius: 'var(--radius-card)', borderWidth: '1px', backdropFilter: 'none' }}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
          style={{ borderRadius: 'var(--radius-button)' }}
          aria-label={t("close")}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}

      <header className="mb-8">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">{t("settings")}</h2>
        <p className="text-sm text-muted mt-1.5">
          {t("settingsDesc")}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <NumberField
          label={t("focusTime")}
          value={settings.focusMinutes}
          min={1}
          max={180}
          onChange={(v) => update("focusMinutes", clamp(v, 1, 180))}
        />
        <NumberField
          label={t("shortBreak")}
          value={settings.shortBreakMinutes}
          min={1}
          max={60}
          onChange={(v) => update("shortBreakMinutes", clamp(v, 1, 60))}
        />
        <NumberField
          label={t("longBreak")}
          value={settings.longBreakMinutes}
          min={1}
          max={120}
          onChange={(v) => update("longBreakMinutes", clamp(v, 1, 120))}
        />
        <NumberField
          label={t("cyclesBeforeLongBreak")}
          value={settings.cyclesBeforeLongBreak}
          min={2}
          max={10}
          onChange={(v) => update("cyclesBeforeLongBreak", clamp(v, 2, 10))}
        />
      </div>

      <div className="mt-8 pt-6 border-t border-card-border/50">
        <label className="flex items-center justify-between group cursor-pointer select-none">
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {t("autoStart")}
          </span>
          <div className="relative inline-flex h-6 w-11 items-center transition-colors duration-200 ease-in-out focus:outline-none" style={{ backgroundColor: settings.autoStart ? 'var(--accent)' : 'var(--muted)', borderRadius: 'var(--radius-button)' }}>
            <input
              type="checkbox"
              className="sr-only"
              checked={settings.autoStart}
              onChange={(e) => update("autoStart", e.target.checked)}
            />
            <span
              className={`inline-block h-4 w-4 transform bg-white transition duration-200 ease-in-out ${
                settings.autoStart ? 'translate-x-6' : 'translate-x-1'
              }`}
              style={{ borderRadius: 'calc(var(--radius-button) - 4px)' }}
            />
          </div>
        </label>
        <p className="text-xs text-muted mt-2">
          {t("autoStartDesc")}
        </p>
      </div>
      
      {onClose && (
        <div className="mt-8 pt-4">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-foreground hover:bg-foreground/80 text-background text-sm font-medium transition-colors"
            style={{ borderRadius: 'var(--radius-button)' }}
          >
            {t("ok")}
          </button>
        </div>
      )}
    </div>
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
      <span className="block text-xs font-medium text-muted mb-1.5">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2.5 text-sm font-medium border-card-border bg-background/50 hover:bg-background focus:outline-none focus:border-accent transition-colors"
        style={{ borderRadius: 'var(--radius-button)', borderWidth: '1px', color: 'var(--foreground)' }}
      />
    </label>
  );
}
