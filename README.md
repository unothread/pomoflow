# Pomoflow

A free, minimal Pomodoro timer with a built-in to-do list and lofi radio. Pick your focus and break lengths, add your tasks, hit start, and work to lofi. Everything runs locally in the browser — no account, no backend, your data stays in your browser.

Live: [pomodoro.ozgurpolat.net](https://pomodoro.ozgurpolat.net)

## Features

- **Customizable Pomodoro cycle** — set focus, short break, and long break durations, plus how many focus sessions run before a long break.
- **Auto-start** — optionally chain sessions automatically; an alarm plays when each one ends.
- **Alarm sounds** — five selectable alarms with preview.
- **Tab-title countdown** — remaining time shows in the browser tab, so you can switch away and still keep an eye on it.
- **To-do list** — add, complete, and clear tasks for your session.
- **Lofi radio** — background music player to focus to.
- **Light / dark theme**.
- **Bilingual UI** — English (default) and Turkish.
- **Local-first** — settings, todos, theme, and language persist in `localStorage`. Nothing leaves the device.
- **SEO-ready** — metadata, Open Graph / Twitter cards, `sitemap.ts`, and `robots.ts` built in.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, `output: "standalone"`)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Google Analytics 4 via `@next/third-parties` (optional)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Environment variables

Both are optional — the app runs without an `.env` file. Copy them into `.env.local` to override. Both are `NEXT_PUBLIC_*`, so they are exposed to the browser; do not put secrets here.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://pomodoro.ozgurpolat.net` | Canonical site URL. Single source of truth for metadata, canonical/OG tags, sitemap, and robots. Set per environment, no trailing slash. |
| `NEXT_PUBLIC_GA_ID` | unset | Google Analytics 4 Measurement ID. Leave unset to disable analytics. |

Example `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Project structure

```
app/
  layout.tsx              Root layout, metadata, fonts, GA
  page.tsx                Server entry
  HomeClient.tsx          Client app shell
  robots.ts, sitemap.ts   SEO routes
  components/             PomodoroTimer, TodoList, LofiPlayer,
                          SettingsPanel, HeaderControls, LandingSEO
  lib/
    site.ts               Canonical URL + OG image config
    i18n.tsx              TR/EN translations + provider
    theme.tsx             Light/dark theme provider
    alarms.ts             Alarm sound registry
    types.ts              Settings, session, todo types + defaults
    useLocalStorage.ts    SSR-safe localStorage hook
public/
  logo.svg
  sounds/alarms/          alarm1–5.mp3
```

## Customizing

- **Default timer settings** — edit `DEFAULT_SETTINGS` in [`app/lib/types.ts`](app/lib/types.ts).
- **Add an alarm sound** — follow the steps documented in [`app/lib/alarms.ts`](app/lib/alarms.ts): add the id to `AlarmId`, add a registry entry, add the i18n labels (TR + EN), and drop the `.mp3` into `public/sounds/alarms/`.
- **Translations** — edit `app/lib/i18n.tsx`.

## Deployment

The app builds to a standalone server (`output: "standalone"` in `next.config.ts`), so it deploys cleanly to any Node host or container. Set `NEXT_PUBLIC_SITE_URL` for the target environment.
