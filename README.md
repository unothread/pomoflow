# Pomoflow

Sade, mobil uyumlu, tek sayfa Pomodoro + Lofi radyo + Yapılacaklar uygulaması.
Next.js 16 (App Router) + React 19 + Tailwind v4 ile yazıldı.

## Özellikler

- **Pomodoro zamanlayıcı** — ayarlanabilir odak / kısa mola / uzun mola süreleri..
  - X kısa moladan sonra 1 uzun mola (varsayılan 4).
  - Başlat / Duraklat / Devam et / Atla / Sıfırla.
  - Otomatik başlatma (seans bitince sonrakini başlatır).
  - Sekme gizliyken otomatik duraklatma (drift önleme).
  - Tarayıcı bildirimi (opsiyonel).
- **Lofi radyo** — YouTube IFrame API ile gizli (0×0) iframe. Sayfa düzeni
  bozulmadan arka planda çalar. Varsayılan: Lofi Girl — beats to relax/study to
  (`X4VbdwhkE10`). Ses seviyesi ayarı, farklı video/canlı yayın ID desteği.
- **Yapılacaklar** — ekle / tamamla / sil, "tamamlananları temizle".
- **Reklam alanları** — `AdBanner` component'i ile 4 hazır slot:
  `top` (leaderboard, üst), `inline` (leaderboard, içerik altı),
  `sidebar` (medium, sağ kolon), `footer` (leaderboard, alt).
  Her biri `data-ad-slot` ve `data-ad-size` ile etiketli; gerçek ağ
  markup'ı (AdSense, Carbon, Ezoic vb.) component'in içindeki placeholder
  div'i değiştirilerek bağlanır.

Tüm kullanıcı verisi (`ayarlar`, `todo listesi`, `lofi video ID`, `ses seviyesi`,
`tamamlanan odak sayısı`) `localStorage`'da saklanır — sunucu tarafı gerektirmez.

## Çalıştırmak

```bash
npm install
npm run dev          # geliştirme: http://localhost:3000
```

Üretim:

```bash
npm run build
npm start
```

Lint:

```bash
npm run lint
```

## Deploy

Standart Next.js app olduğu için herhangi bir Node 20+ host'a (Vercel,
Coolify, kendi sunucun) doğrudan deploy edilebilir. `next build` çıktısı
`.next/` klasöründe durur.

Vercel için:

```bash
npx vercel
```

### Coolify (Dockerfile)

Repo kökündeki `Dockerfile` Coolify'nin "Dockerfile" build pack'i ile
birebir uyumlu. `next.config.ts` `output: "standalone"` kullandığı için
final image ~150 MB civarında.

Coolify'da yapman gereken tek şey:

1. **New Resource → Application** → "Public/Private Repository (with
   Dockerfile)" seç, `unothread/pomoflow` repo'sunu bağla.
2. **Build Pack**: `Dockerfile` (default).
3. **Port**: `3000` (Coolify genelde Dockerfile'ın `EXPOSE`'unu okur,
   yine de kontrol et).
4. **Healthcheck Path**: `/` (opsiyonel, Dockerfile'da `curl` ile yaptım).
5. **Environment Variables**: gerekmez — tüm ayarlar tarayıcıda
   `localStorage`'da tutuluyor.
6. **Domain**: istediğin subdomain'i bağla, HTTPS Coolify'dan otomatik.

Coolify repo'yu ilk build'de klonlarken Docker context'in şişmemesi
için `.dockerignore` eklendi (`node_modules`, `.next/`, `.git/` vb.).

## Yapı

```
app/
  layout.tsx                 # kök layout, metadata, viewport
  page.tsx                   # tek sayfa düzeni
  globals.css                # Tailwind v4 import + tema
  components/
    AdBanner.tsx             # placeholder reklam alanı
    LofiPlayer.tsx           # YouTube IFrame API client
    PomodoroTimer.tsx        # pomodoro state machine (useReducer)
    SettingsPanel.tsx        # süre + döngü ayarları
    TodoList.tsx             # ekle/tamamla/sil
  lib/
    useLocalStorage.ts       # SSR-safe localStorage hook
    types.ts                 # tipler + varsayılan ayarlar
```
