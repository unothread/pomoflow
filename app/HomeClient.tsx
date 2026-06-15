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
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-6 min-h-[100dvh] lg:h-dvh">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6 shrink-0 mt-4 sm:mt-0">
          <header className="text-left">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Pomodoro Timer"
                width={36}
                height={36}
                className="h-9 w-9 shrink-0"
              />
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {t("title")}
              </h1>
            </div>
            <p className="text-sm text-muted mt-1.5">
              {t("subtitle")}
            </p>
          </header>
          <div className="self-start sm:self-auto shrink-0">
            <HeaderControls />
          </div>
        </div>

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
          <p className="text-xs text-muted">
            {t("footer")}
          </p>
          <p className="text-xs text-muted">
            designed and developed by{" "}
            <a
              href="https://ozgurpolat.net"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              ozgurpolat.net
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}