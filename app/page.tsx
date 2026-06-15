import AdBanner from "./components/AdBanner";
import LofiPlayer from "./components/LofiPlayer";
import PomodoroTimer from "./components/PomodoroTimer";
import SettingsPanel from "./components/SettingsPanel";
import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Pomoflow
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Odaklan, mola ver, lofi dinle. Sadece iş.
          </p>
        </div>
      </header>

      <AdBanner slot="top" size="leaderboard" className="mb-6" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <PomodoroTimer />
          <LofiPlayer />
          <AdBanner slot="inline" size="leaderboard" />
        </div>

        <aside className="space-y-4 sm:space-y-6">
          <SettingsPanel />
          <TodoList />
          <AdBanner slot="sidebar" size="medium" />
        </aside>
      </div>

      <footer className="mt-8 sm:mt-10 space-y-3">
        <AdBanner slot="footer" size="leaderboard" />
        <p className="text-center text-xs text-zinc-400">
          Pomoflow · yerel olarak çalışır, verilerin tarayıcında saklanır.
        </p>
      </footer>
    </div>
  );
}
