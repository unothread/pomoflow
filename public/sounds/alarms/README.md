# Alarm sounds

Alarm audio files. Filenames must match exactly (case-sensitive):

| Setting label | File required  |
| ------------- | -------------- |
| Alarm 1       | `alarm1.mp3`   |
| Alarm 2       | `alarm2.mp3`   |
| Alarm 3       | `alarm3.mp3`   |
| Alarm 4       | `alarm4.mp3`   |
| Alarm 5       | `alarm5.mp3`   |

- Format: `.mp3`. Keep them short (1–3 s) and small.
- Served at `/sounds/alarms/<file>` — registry is in `app/lib/alarms.ts`.
- `alarm1.mp3` is the default alarm.

## Adding a new alarm type later

1. Add the id to `AlarmId` in `app/lib/types.ts`
2. Add an entry to `ALARM_SOUNDS` in `app/lib/alarms.ts`
3. Add its label key to both `tr` and `en` in `app/lib/i18n.tsx`
4. Drop the matching audio file here
