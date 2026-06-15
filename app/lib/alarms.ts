import type { AlarmId } from "./types";
import type { TranslationKey } from "./i18n";

export interface AlarmSound {
  id: AlarmId;
  /** i18n key for the display name. */
  labelKey: TranslationKey;
  /** File expected under public/sounds/alarms/ */
  file: string;
}

/** Public path where alarm audio files live. Drop sound files here. */
export const ALARM_DIR = "/sounds/alarms";

export const DEFAULT_ALARM: AlarmId = "alarm1";

/**
 * Registry of selectable alarm sounds. To add a new alarm:
 *   1. Add its id to `AlarmId` in types.ts
 *   2. Add an entry here with its filename
 *   3. Add the label key to i18n (tr + en)
 *   4. Drop the audio file into public/sounds/alarms/
 */
export const ALARM_SOUNDS: readonly AlarmSound[] = [
  { id: "alarm1", labelKey: "alarm1", file: "alarm1.mp3" },
  { id: "alarm2", labelKey: "alarm2", file: "alarm2.mp3" },
  { id: "alarm3", labelKey: "alarm3", file: "alarm3.mp3" },
  { id: "alarm4", labelKey: "alarm4", file: "alarm4.mp3" },
  { id: "alarm5", labelKey: "alarm5", file: "alarm5.mp3" },
];

export function alarmSrc(id: AlarmId): string {
  const sound = ALARM_SOUNDS.find((s) => s.id === id) ?? ALARM_SOUNDS[0];
  return `${ALARM_DIR}/${sound.file}`;
}

let current: HTMLAudioElement | null = null;

/** Play the given alarm. Stops any alarm already playing. Safe to call anywhere. */
export function playAlarm(id: AlarmId, volume = 1): void {
  if (typeof Audio === "undefined") return;
  try {
    if (current) {
      current.pause();
      current.currentTime = 0;
    }
    const audio = new Audio(alarmSrc(id));
    audio.volume = Math.min(1, Math.max(0, volume));
    current = audio;
    void audio.play().catch(() => {
      /* autoplay blocked or file missing — ignore */
    });
  } catch {
    /* noop */
  }
}
