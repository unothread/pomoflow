/**
 * Canonical site URL — single source of truth for metadata, canonical/OG
 * tags, robots and sitemap. Override per environment with NEXT_PUBLIC_SITE_URL
 * (no trailing slash); falls back to the production subdomain.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://pomodoro.ozgurpolat.net";

/** Default Open Graph / social share image. Drop the file in public/. */
export const OG_IMAGE = "/og-image.png";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
