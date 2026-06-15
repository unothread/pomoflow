"use client";

import LofiPlayer from "./components/LofiPlayer";
import PomodoroTimer from "./components/PomodoroTimer";
import TodoList from "./components/TodoList";
import HeaderControls from "./components/HeaderControls";
import LandingSEO from "./components/LandingSEO";
import { useI18n } from "./lib/i18n";

export default function HomeClient() {
  const { t } = useI18n();

  return (
    <div className="flex-1 flex flex-col w-full mx-auto relative">
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-6 min-h-[100dvh]">
        <HeaderControls />

        <header className="mb-4 sm:mb-6 text-left shrink-0 mt-4 sm:mt-0">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-sm text-muted mt-1.5">
            {t("subtitle")}
          </p>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 grid-rows-[auto_minmax(0,1fr)] lg:grid-rows-1 gap-4 sm:gap-6 min-h-0">
          <div className="w-full flex flex-col self-start min-h-0">
            <PomodoroTimer />
          </div>

          <aside className="w-full flex flex-col min-h-0 overflow-hidden">
            <TodoList />
          </aside>
        </div>

        <div className="mt-4 sm:mt-6 w-full shrink-0">
          <LofiPlayer />
        </div>
      </div>
      
      <LandingSEO />

      <footer className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-8 border-t border-card-border shrink-0">
        <p className="text-center text-xs text-muted">
          {t("footer")}
        </p>
      </footer>
    </div>
  );
}