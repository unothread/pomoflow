type Size = "leaderboard" | "medium" | "mobile";

type Props = {
  slot: string;
  size?: Size;
  className?: string;
};

const SIZE_CLASS: Record<Size, string> = {
  leaderboard: "h-24 sm:h-20", // 728x90
  medium: "h-24", // 300x250
  mobile: "h-16", // 320x50
};

/**
 * Placeholder ad slot. Replace the inner div with your ad network
 * (Google AdSense, Carbon, Ezoic, etc.) markup when you wire it up.
 *
 * The slot prop is a stable identifier (e.g. "top", "sidebar", "inline")
 * so you can target ad units by name later.
 */
export default function AdBanner({ slot, size = "medium", className = "" }: Props) {
  return (
    <aside
      data-ad-slot={slot}
      data-ad-size={size}
      role="complementary"
      aria-label={`Reklam alanı: ${slot}`}
      className={`w-full ${className}`}
    >
      <div
        className={`w-full ${SIZE_CLASS[size]} rounded-lg border border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center text-[11px] text-zinc-400 uppercase tracking-wider`}
      >
        Reklam · {slot} · {size}
      </div>
    </aside>
  );
}
