"use client";

import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";

const STREAM_KEY = "pomoflow.lofi.videoId.v1";
const VOLUME_KEY = "pomoflow.lofi.volume.v1";
const DEFAULT_VIDEO_ID = "jfKfPfyJRdk"; // lofi girl - beats to relax/study to

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
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setVideoId(trimmed);
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            playing ? "bg-rose-100 text-rose-600" : "bg-zinc-100 text-zinc-500"
          }`}
          aria-hidden
        >
          {playing ? (
            <span className="flex items-end gap-0.5 h-4">
              <span className="w-1 h-4 bg-current animate-pulse" />
              <span className="w-1 h-3 bg-current animate-pulse [animation-delay:120ms]" />
              <span className="w-1 h-4 bg-current animate-pulse [animation-delay:240ms]" />
            </span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-zinc-900 truncate">
            Lofi radyo
          </div>
          <div className="text-xs text-zinc-500 truncate">
            {playing ? "Çalıyor" : ready ? "Duraklatıldı" : "Yükleniyor…"}
          </div>
        </div>

        <button
          type="button"
          onClick={toggle}
          disabled={!ready}
          className="px-4 py-2 rounded-full bg-zinc-900 text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700"
        >
          {playing ? "Durdur" : "Çal"}
        </button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-zinc-500 w-12">Ses</span>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 accent-rose-500"
          aria-label="Ses seviyesi"
        />
        <span className="text-xs text-zinc-500 w-8 text-right tabular-nums">
          {volume}
        </span>
      </div>

      <details className="mt-3">
        <summary className="text-xs text-zinc-500 cursor-pointer select-none">
          Farklı bir YouTube video/canlı yayın kullan
        </summary>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="YouTube video/canlı yayın ID"
            className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200"
          />
          <button
            type="button"
            onClick={applyNewId}
            className="px-3 py-1.5 text-sm rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
          >
            Uygula
          </button>
        </div>
        <p className="mt-1 text-[11px] text-zinc-400">
          Örn: <code className="font-mono">jfKfPfyJRdk</code> — Lofi Girl
        </p>
      </details>

      {/* Hidden mount point for the YT iframe. The iframe itself is 0x0
          so the page stays clean; audio plays in the background. */}
      <div
        ref={containerRef}
        aria-hidden
        className="w-0 h-0 overflow-hidden absolute opacity-0 pointer-events-none"
      />
    </section>
  );
}
