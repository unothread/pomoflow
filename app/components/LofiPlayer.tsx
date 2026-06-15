"use client";

import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";
import { useI18n } from "../lib/i18n";
import { useTheme } from "../lib/theme";

const STREAM_KEY = "pomoflow.lofi.videoId.v1";
const VOLUME_KEY = "pomoflow.lofi.volume.v1";
const DEFAULT_VIDEO_ID = "X4VbdwhkE10"; // lofi girl - beats to relax/study to

// YouTube IFrame API types (minimal).
declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          height?: string | number;
          width?: string | number;
          videoId?: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number; target: YTPlayer }) => void;
            onError?: (e: { data: number; target: YTPlayer }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  getPlayerState: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (n: number) => void;
  getVolume: () => number;
  loadVideoById: (id: string) => void;
  cueVideoById: (id: string) => void;
  destroy: () => void;
};

let apiLoadingPromise: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiLoadingPromise) return apiLoadingPromise;
  apiLoadingPromise = new Promise<void>((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.head.appendChild(tag);
  });
  return apiLoadingPromise;
}

export default function LofiPlayer() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const [videoId, setVideoId] = useLocalStorage<string>(STREAM_KEY, DEFAULT_VIDEO_ID);
  const [volume, setVolume] = useLocalStorage<number>(VOLUME_KEY, 60);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [inputValue, setInputValue] = useState(videoId);
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize the iframe API and player once.
  useEffect(() => {
    let cancelled = false;

    loadYouTubeAPI().then(() => {
      if (cancelled || !containerRef.current) return;
      // The container must contain a target div for YT.Player to replace.
      // Ensure it has one.
      if (!containerRef.current.querySelector("div")) {
        const target = document.createElement("div");
        containerRef.current.appendChild(target);
      }
      const target =
        containerRef.current.querySelector("div") || containerRef.current;
      playerRef.current = new window.YT!.Player(target as HTMLElement, {
        height: "0",
        width: "0",
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (e) => {
            e.target.setVolume(volume);
            setReady(true);
          },
          onStateChange: (e) => {
            const YT = window.YT!.PlayerState;
            if (e.data === YT.PLAYING) setPlaying(true);
            else if (e.data === YT.PAUSED || e.data === YT.ENDED) setPlaying(false);
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* noop */
      }
      playerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to videoId changes.
  useEffect(() => {
    if (!ready || !playerRef.current) return;
    try {
      playerRef.current.loadVideoById(videoId);
    } catch {
      /* noop */
    }
  }, [videoId, ready]);

  // React to volume changes.
  useEffect(() => {
    if (!ready || !playerRef.current) return;
    try {
      playerRef.current.setVolume(Math.max(0, Math.min(100, volume)));
    } catch {
      /* noop */
    }
  }, [volume, ready]);

  const toggle = () => {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const applyNewId = () => {
    let trimmed = inputValue.trim();
    if (!trimmed) return;
    
    // Attempt to extract video ID from URL
    try {
      if (trimmed.includes("youtube.com") || trimmed.includes("youtu.be")) {
        const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
        if (trimmed.includes("youtu.be")) {
          trimmed = url.pathname.slice(1);
        } else if (url.searchParams.has("v")) {
          trimmed = url.searchParams.get("v") || trimmed;
        }
      }
    } catch {
      // If parsing fails, just use the trimmed string
    }

    setVideoId(trimmed);
  };

  return (
    <section className="bg-card border-card-border p-6 sm:p-8 shadow-sm transition-colors duration-500" style={{ borderRadius: 'var(--radius-card)', borderWidth: '1px' }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggle}
            disabled={!ready}
            className={`shrink-0 w-14 h-14 flex items-center justify-center transition-all ${
              playing 
                ? "bg-accent text-accent-foreground hover:opacity-90" 
                : "bg-background border border-card-border text-foreground hover:bg-background/80 disabled:opacity-50"
            }`}
            style={{ borderRadius: 'var(--radius-button)' }}
            aria-label={playing ? t("stop") : t("play")}
          >
            {playing ? (
              <span className="flex items-end gap-1 h-5">
                <span className="w-1.5 h-5 bg-current rounded-full animate-pulse" />
                <span className="w-1.5 h-3 bg-current rounded-full animate-pulse [animation-delay:120ms]" />
                <span className="w-1.5 h-4 bg-current rounded-full animate-pulse [animation-delay:240ms]" />
              </span>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-foreground tracking-tight">
              {t("lofiTitle")}
            </div>
            <div className="text-sm text-muted mt-0.5">
              {playing ? t("playing") : ready ? t("paused") : t("loading")}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:min-w-48">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1"
            style={{ accentColor: theme === 'garden' ? '#10b981' : '#8b5cf6' }}
            aria-label="Ses seviyesi"
          />
        </div>
      </div>

      <details className="mt-6 group">
        <summary className="text-xs font-medium text-muted cursor-pointer select-none flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-open:rotate-90">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          {t("customStream")}
        </summary>
        <div className="mt-3 flex gap-2 pl-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="YouTube video ID"
            className="flex-1 min-w-0 px-3 py-2 text-sm border-card-border bg-background/50 text-foreground focus:outline-none focus:border-accent transition-colors"
            style={{ borderRadius: 'var(--radius-button)', borderWidth: '1px' }}
          />
          <button
            type="button"
            onClick={applyNewId}
            className="px-4 py-2 text-sm font-medium bg-background border border-card-border hover:bg-background/80 text-foreground transition-colors"
            style={{ borderRadius: 'var(--radius-button)' }}
          >
            {t("apply")}
          </button>
        </div>
      </details>

      <div
        ref={containerRef}
        aria-hidden
        className="w-0 h-0 overflow-hidden absolute opacity-0 pointer-events-none"
      />
    </section>
  );
}
