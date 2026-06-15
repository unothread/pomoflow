"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Language = "tr" | "en";

const translations = {
  tr: {
    title: "Pomodoro",
    subtitle: "Odaklan, mola ver, lofi dinle. Sadece iş.",
    footer: "Pomodoro · yerel olarak çalışır, verilerin tarayıcında saklanır.",
    settings: "Ayarlar",
    settingsDesc: "Değişiklikler otomatik kaydedilir.",
    focusTime: "Odak süresi (dk)",
    shortBreak: "Kısa mola (dk)",
    longBreak: "Uzun mola (dk)",
    cyclesBeforeLongBreak: "Uzun moladan önceki",
    autoStart: "Otomatik devam et",
    autoStartDesc: "Seans bitince alarm çalar ve sıradaki seans başlar.",
    ok: "Tamam",
    todos: "Yapılacaklar",
    left: "kaldı",
    doneLabel: "tamam",
    addTodo: "Yeni görev ekle…",
    add: "Ekle",
    emptyTodo: "Odaklanma seansı için görevlerini listele.",
    clearDone: "Tamamlananları temizle",
    lofiTitle: "Lofi Radyo",
    playing: "Çalıyor",
    paused: "Duraklatıldı",
    loading: "Yükleniyor…",
    stop: "Durdur",
    play: "Çal",
    customStream: "Farklı yayın kullan",
    apply: "Uygula",
    idle: "Hazır",
    focus: "Odak",
    shortBreakLabel: "Kısa mola",
    longBreakLabel: "Uzun mola",
    startFocus: "Odaklanmayı başlat",
    startShortBreak: "Kısa mola",
    startLongBreak: "Uzun mola",
    pause: "Duraklat",
    resume: "Devam et",
    skip: "Atla",
    reset: "Sıfırla",
    enableNotifs: "Bildirimleri aç",
    round: "tur",
    cyclesInfo: "kısa mola, 1 uzun",
  },
  en: {
    title: "Pomodoro",
    subtitle: "Focus, take a break, listen to lofi. Just work.",
    footer: "Pomodoro · runs locally, data is stored in your browser.",
    settings: "Settings",
    settingsDesc: "Changes are saved automatically.",
    focusTime: "Focus time (min)",
    shortBreak: "Short break (min)",
    longBreak: "Long break (min)",
    cyclesBeforeLongBreak: "Breaks before long break",
    autoStart: "Auto-start next session",
    autoStartDesc: "When a session ends, alarm rings and next session starts.",
    ok: "Done",
    todos: "Tasks",
    left: "left",
    doneLabel: "done",
    addTodo: "Add new task…",
    add: "Add",
    emptyTodo: "List your tasks for the focus session.",
    clearDone: "Clear completed",
    lofiTitle: "Lofi Radio",
    playing: "Playing",
    paused: "Paused",
    loading: "Loading…",
    stop: "Stop",
    play: "Play",
    customStream: "Use custom stream",
    apply: "Apply",
    idle: "Ready",
    focus: "Focus",
    shortBreakLabel: "Short break",
    longBreakLabel: "Long break",
    startFocus: "Start focus",
    startShortBreak: "Short break",
    startLongBreak: "Long break",
    pause: "Pause",
    resume: "Resume",
    skip: "Skip",
    reset: "Reset",
    enableNotifs: "Enable notifications",
    round: "round",
    cyclesInfo: "short breaks, 1 long",
  }
};

type Translations = typeof translations.tr;
export type TranslationKey = keyof Translations;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage<Language>("pomoflow.lang", "en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: TranslationKey): string => {
    if (!mounted) return translations.en[key]; // Default for SSR
    return translations[lang][key];
  };

  return (
    <I18nContext.Provider value={{ lang: mounted ? lang : "en", setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}