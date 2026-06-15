"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";

type Language = "tr" | "en";

const translations = {
  tr: {
    title: "Pomodoro Timer",
    subtitle: "Odaklan, mola ver, lofi dinle. Sadece iş.",
    footer: "Pomodoro Timer · yerel olarak çalışır, verilerin tarayıcında saklanır.",
    settings: "Ayarlar",
    settingsBtn: "Ayarlar",
    close: "Kapat",
    volume: "Ses seviyesi",
    settingsDesc: "Değişiklikler otomatik kaydedilir.",
    focusTime: "Odak süresi (dk)",
    shortBreak: "Kısa mola (dk)",
    longBreak: "Uzun mola (dk)",
    cyclesBeforeLongBreak: "Uzun moladan önceki",
    autoStart: "Otomatik devam et",
    autoStartDesc: "Seans bitince alarm çalar ve sıradaki seans başlar.",
    alarmSound: "Alarm sesi",
    preview: "Dinle",
    alarm1: "Alarm 1",
    alarm2: "Alarm 2",
    alarm3: "Alarm 3",
    alarm4: "Alarm 4",
    alarm5: "Alarm 5",
    ok: "Tamam",
    todos: "Yapılacaklar",
    left: "kaldı",
    doneLabel: "tamam",
    addTodo: "Yeni görev ekle…",
    add: "Ekle",
    delete: "Sil",
    emptyTodo: "Odaklanma seansı için görevlerini listele.",
    clearDone: "Tamamlananları temizle",
    lofiTitle: "Lofi Radyo",
    playing: "Çalıyor",
    paused: "Duraklatıldı",
    loading: "Yükleniyor…",
    stop: "Durdur",
    play: "Çal",
    customStream: "Farklı yayın kullan",
    youtubePlaceholder: "YouTube canlı yayın veya video linki",
    apply: "Uygula",
    idle: "Hazır",
    focus: "Odak",
    shortBreakLabel: "Kısa mola",
    longBreakLabel: "Uzun mola",
    startFocus: "Odaklanmayı başlat",
    startShortBreak: "Kısa mola",
    startLongBreak: "Uzun mola",
    pause: "Duraklat",
    resume: "Devam et",
    skip: "Atla",
    reset: "Sıfırla",
    enableNotifs: "Bildirimleri aç",
    round: "tur",
    cyclesInfo: "kısa mola, 1 uzun",
    
    // Landing SEO
    landingTitle1: "Pomodoro Nedir?",
    landingP1_1: "<strong>Pomodoro Tekniği</strong>, 1980'lerin sonlarında Francesco Cirillo tarafından geliştirilen bir zaman yönetimi yöntemidir. Teknik, işi geleneksel olarak 25 dakika uzunluğunda, kısa molalarla ayrılmış aralıklara bölmek için bir zamanlayıcı kullanır. Bu aralıkların her birine, Cirillo'nun üniversite öğrencisiyken kullandığı domates şeklindeki mutfak zamanlayıcısının İtalyanca kelimesinden gelen bir <em class='italic'>pomodoro</em> denir.",
    landingP1_2: "<strong>Pomodoro sayacı</strong> kullanmanın temel amacı, odaklanmayı artırmak ve zihinsel yorgunluğu azaltmaktır. Sürekli uzun saatler çalışmak yerine, beyni düzenli aralıklarla dinlendirerek gün boyu yüksek verimlilik elde edebilirsiniz.",
    landingTitle2: "Bu Sitede Neler Var? (Özellikler)",
    landingFeature1Title: "Zamanlayıcı (Timer)",
    landingFeature1Desc: "Klasik 25 dakikalık odak, 5 dakikalık kısa mola ve 15 dakikalık uzun mola döngülerini kullanın. Ayarlar menüsünden tüm bu süreleri kendi çalışma alışkanlıklarınıza göre özelleştirebilirsiniz.",
    landingFeature2Title: "Yapılacaklar Listesi",
    landingFeature2Desc: "Odaklanacağınız görevleri ekleyin ve tamamladıkça üzerini çizin. Basit ve dikkat dağıtmayan to-do listesi sayesinde sıradaki işinizi her zaman göz önünde bulundurun.",
    landingFeature3Title: "Lofi Radyo & Müzik",
    landingFeature3Desc: "Araştırmalar, sözsüz ve düşük tempolu (Lofi) müziklerin odaklanmayı artırdığını gösteriyor. Entegre radyomuzu kullanarak ekstra bir sekme açmadan Lofi Hip Hop dinleyebilirsiniz.",
    landingHowToChangeMusic: "Müzik Nasıl Değiştirilir?",
    landingHowToChangeMusicDesc: "Lofi radyonun hemen altındaki \"Farklı yayın kullan\" alanına dilediğiniz YouTube canlı yayın veya video linkini yapıştırıp \"Uygula\" butonuna basın. Sistem otomatik olarak o müziği çalmaya başlayacaktır.",
    landingTitle3: "Pomodoro Manifestosu & Kapsamlı Rehber",
    landingSub1: "Neden İşe Yarıyor?",
    landingSub1Desc: "Modern çağda dikkat dağıtıcı unsurlar (bildirimler, e-postalar, sosyal medya) her yerde. Zihnimiz sürekli olarak \"context switching\" (bağlam değiştirme) yapıyor ve bu da bizi gün sonunda bitkin düşürüyor. <strong>Pomodoro tekniği</strong>, size basit bir sözleşme sunar: <em class='italic'>\"Sadece 25 dakika boyunca tek bir şeye odaklanacağım.\"</em> Bu kısa süre, ertelemeyi (procrastination) yenmek için yeterince makul bir hedeftir.",
    landingSub2: "Nasıl Uygulanır?",
    landingStep1: "<strong>Görevini Seç:</strong> Yapılacaklar listene odaklanacağın tek bir görevi yaz.",
    landingStep2: "<strong>Zamanlayıcıyı Başlat:</strong> 25 dakikalık \"Odak\" (Focus) sayacını çalıştır.",
    landingStep3: "<strong>Sadece Çalış:</strong> Süre bitene kadar telefonuna bakma, başka sekmeye geçme.",
    landingStep4: "<strong>Kısa Mola Ver:</strong> Alarm çaldığında 5 dakika dinlen. Ayağa kalk, su iç, gerin.",
    landingStep5: "<strong>Döngüyü Tekrarla:</strong> 4 Pomodoro döngüsünü tamamladıktan sonra (yaklaşık 2 saat), 15-30 dakikalık uzun bir mola (Long Break) ver.",
    landingSub3: "Kimler İçin Uygundur?",
    landingSub3Desc: "Sınavlara hazırlanan öğrenciler, yazılımcılar, tasarımcılar, yazarlar, home-office çalışanlar ve dikkatini toplamakta zorlanan herkes için idealdir. Bizim aracımız gibi sade bir <strong>online pomodoro sayacı</strong> kullanmak, ekstra bir uygulama indirme veya karmaşık ayarlarla uğraşma derdini ortadan kaldırır."
  },
  en: {
    title: "Pomodoro Timer",
    subtitle: "Focus, take a break, listen to lofi. Just work.",
    footer: "Pomodoro Timer · runs locally, data is stored in your browser.",
    settings: "Settings",
    settingsBtn: "Settings",
    close: "Close",
    volume: "Volume",
    settingsDesc: "Changes are saved automatically.",
    focusTime: "Focus time (min)",
    shortBreak: "Short break (min)",
    longBreak: "Long break (min)",
    cyclesBeforeLongBreak: "Breaks before long break",
    autoStart: "Auto-start next session",
    autoStartDesc: "When a session ends, alarm rings and next session starts.",
    alarmSound: "Alarm sound",
    preview: "Preview",
    alarm1: "Alarm 1",
    alarm2: "Alarm 2",
    alarm3: "Alarm 3",
    alarm4: "Alarm 4",
    alarm5: "Alarm 5",
    ok: "Done",
    todos: "Tasks",
    left: "left",
    doneLabel: "done",
    addTodo: "Add new task…",
    add: "Add",
    delete: "Delete",
    emptyTodo: "List your tasks for the focus session.",
    clearDone: "Clear completed",
    lofiTitle: "Lofi Radio",
    playing: "Playing",
    paused: "Paused",
    loading: "Loading…",
    stop: "Stop",
    play: "Play",
    customStream: "Use custom stream",
    youtubePlaceholder: "YouTube video or live stream link",
    apply: "Apply",
    idle: "Ready",
    focus: "Focus",
    shortBreakLabel: "Short break",
    longBreakLabel: "Long break",
    startFocus: "Start focus",
    startShortBreak: "Short break",
    startLongBreak: "Long break",
    pause: "Pause",
    resume: "Resume",
    skip: "Skip",
    reset: "Reset",
    enableNotifs: "Enable notifications",
    round: "round",
    cyclesInfo: "short breaks, 1 long",

    // Landing SEO
    landingTitle1: "What is Pomodoro?",
    landingP1_1: "<strong>The Pomodoro Technique</strong> is a time management method developed by Francesco Cirillo in the late 1980s. The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a <em class='italic'>pomodoro</em>, from the Italian word for 'tomato', after the tomato-shaped kitchen timer that Cirillo used as a university student.",
    landingP1_2: "The main goal of using a <strong>Pomodoro timer</strong> is to increase focus and reduce mental fatigue. Instead of working continuously for long hours, resting your brain at regular intervals helps you achieve high productivity throughout the day.",
    landingTitle2: "What's on this site? (Features)",
    landingFeature1Title: "Timer",
    landingFeature1Desc: "Use the classic 25-minute focus, 5-minute short break, and 15-minute long break cycles. You can customize all these durations according to your working habits from the settings menu.",
    landingFeature2Title: "To-Do List",
    landingFeature2Desc: "Add the tasks you'll focus on and cross them off as you complete them. Keep your next task always in sight thanks to the simple and distraction-free to-do list.",
    landingFeature3Title: "Lofi Radio & Music",
    landingFeature3Desc: "Research shows that wordless and low-tempo (Lofi) music increases focus. You can listen to Lofi Hip Hop using our integrated radio without opening an extra tab.",
    landingHowToChangeMusic: "How to Change Music?",
    landingHowToChangeMusicDesc: "Paste any YouTube live stream or video link into the \"Use custom stream\" field right under the Lofi radio and click \"Apply\". The system will automatically start playing that music.",
    landingTitle3: "Pomodoro Manifesto & Comprehensive Guide",
    landingSub1: "Why it works?",
    landingSub1Desc: "In the modern age, distractions (notifications, emails, social media) are everywhere. Our minds are constantly \"context switching\", which leaves us exhausted by the end of the day. The <strong>Pomodoro technique</strong> offers you a simple contract: <em class='italic'>\"I will focus on just one thing for 25 minutes.\"</em> This short period is a reasonable enough goal to overcome procrastination.",
    landingSub2: "How to Apply?",
    landingStep1: "<strong>Choose your task:</strong> Write down a single task to focus on in your to-do list.",
    landingStep2: "<strong>Start the timer:</strong> Start the 25-minute \"Focus\" timer.",
    landingStep3: "<strong>Just work:</strong> Don't look at your phone or switch tabs until the time is up.",
    landingStep4: "<strong>Take a short break:</strong> Rest for 5 minutes when the alarm rings. Stand up, drink water, stretch.",
    landingStep5: "<strong>Repeat the cycle:</strong> After completing 4 Pomodoro cycles (about 2 hours), take a long break (15-30 minutes).",
    landingSub3: "Who is it for?",
    landingSub3Desc: "It is ideal for students preparing for exams, software developers, designers, writers, home-office workers, and anyone who has difficulty concentrating. Using a simple <strong>online pomodoro timer</strong> like our tool eliminates the hassle of downloading an extra application or dealing with complex settings."
  }
};

type Translations = typeof translations.tr;
export type TranslationKey = keyof Translations;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useLocalStorage<Language>("pomoflow.lang", "en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: TranslationKey): string => {
    if (!mounted) return translations.en[key]; // Default for SSR
    return translations[lang][key];
  };

  return (
    <I18nContext.Provider value={{ lang: mounted ? lang : "en", setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}