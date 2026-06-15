export default function LandingSEO() {
  return (
    <div className="w-full bg-card border-y border-card-border py-12 sm:py-20 mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <article className="max-w-none text-muted leading-relaxed">
          
          <h2 className="text-2xl sm:text-3xl mb-4 text-foreground font-semibold font-space">Pomodoro Nedir?</h2>
          <p className="mb-4">
            <strong className="text-foreground font-medium">Pomodoro Tekniği</strong>, 1980'lerin sonlarında Francesco Cirillo tarafından geliştirilen bir zaman yönetimi yöntemidir. Teknik, işi geleneksel olarak 25 dakika uzunluğunda, kısa molalarla ayrılmış aralıklara bölmek için bir zamanlayıcı kullanır. Bu aralıkların her birine, Cirillo'nun üniversite öğrencisiyken kullandığı domates şeklindeki mutfak zamanlayıcısının İtalyanca kelimesinden gelen bir <em className="italic">pomodoro</em> denir.
          </p>
          <p className="mb-4">
            Pomodoro sayacı kullanmanın temel amacı, odaklanmayı artırmak ve zihinsel yorgunluğu azaltmaktır. Sürekli uzun saatler çalışmak yerine, beyni düzenli aralıklarla dinlendirerek gün boyu yüksek verimlilik elde edebilirsiniz.
          </p>

          <hr className="my-8 border-card-border" />

          <h2 className="text-2xl sm:text-3xl mb-4 text-foreground font-semibold font-space">Bu Sitede Neler Var? (Özellikler)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
            <div className="bg-background border border-card-border p-5 rounded-xl">
              <h3 className="font-semibold text-foreground text-lg mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Zamanlayıcı (Timer)
              </h3>
              <p className="text-sm">
                Klasik 25 dakikalık odak, 5 dakikalık kısa mola ve 15 dakikalık uzun mola döngülerini kullanın. Ayarlar menüsünden tüm bu süreleri kendi çalışma alışkanlıklarınıza göre özelleştirebilirsiniz.
              </p>
            </div>
            
            <div className="bg-background border border-card-border p-5 rounded-xl">
              <h3 className="font-semibold text-foreground text-lg mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"/></svg>
                Yapılacaklar Listesi
              </h3>
              <p className="text-sm">
                Odaklanacağınız görevleri ekleyin ve tamamladıkça üzerini çizin. Basit ve dikkat dağıtmayan to-do listesi sayesinde sıradaki işinizi her zaman göz önünde bulundurun.
              </p>
            </div>

            <div className="bg-background border border-card-border p-5 rounded-xl sm:col-span-2">
              <h3 className="font-semibold text-foreground text-lg mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                Lofi Radyo & Müzik
              </h3>
              <p className="text-sm mb-3">
                Araştırmalar, sözsüz ve düşük tempolu (Lofi) müziklerin odaklanmayı artırdığını gösteriyor. Entegre radyomuzu kullanarak ekstra bir sekme açmadan Lofi Hip Hop dinleyebilirsiniz.
              </p>
              <div className="bg-card p-3 rounded-lg border border-card-border/50 text-xs">
                <strong className="text-foreground block mb-1">Müzik Nasıl Değiştirilir?</strong>
                Ayarlar (⚙️) menüsüne girin ve "Farklı yayın kullan" (Custom stream) alanına dilediğiniz YouTube canlı yayın veya video linkini yapıştırın. Sistem otomatik olarak o müziği çalmaya başlayacaktır.
              </div>
            </div>
          </div>

          <hr className="my-8 border-card-border" />

          <h2 className="text-2xl sm:text-3xl mb-4 text-foreground font-semibold font-space">Pomodoro Manifestosu & Kapsamlı Rehber</h2>
          
          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3 font-space">Neden İşe Yarıyor?</h3>
          <p className="mb-4">
            Modern çağda dikkat dağıtıcı unsurlar (bildirimler, e-postalar, sosyal medya) her yerde. Zihnimiz sürekli olarak "context switching" (bağlam değiştirme) yapıyor ve bu da bizi gün sonunda bitkin düşürüyor. Pomodoro tekniği, size basit bir sözleşme sunar: <em className="italic">"Sadece 25 dakika boyunca tek bir şeye odaklanacağım."</em> Bu kısa süre, ertelemeyi (procrastination) yenmek için yeterince makul bir hedeftir.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3 font-space">Nasıl Uygulanır?</h3>
          <ol className="list-decimal pl-5 mb-4 space-y-2">
            <li><strong className="text-foreground font-medium">Görevini Seç:</strong> Yapılacaklar listene odaklanacağın tek bir görevi yaz.</li>
            <li><strong className="text-foreground font-medium">Zamanlayıcıyı Başlat:</strong> 25 dakikalık "Odak" (Focus) sayacını çalıştır.</li>
            <li><strong className="text-foreground font-medium">Sadece Çalış:</strong> Süre bitene kadar telefonuna bakma, başka sekmeye geçme.</li>
            <li><strong className="text-foreground font-medium">Kısa Mola Ver:</strong> Alarm çaldığında 5 dakika dinlen. Ayağa kalk, su iç, gerin.</li>
            <li><strong className="text-foreground font-medium">Döngüyü Tekrarla:</strong> 4 Pomodoro döngüsünü tamamladıktan sonra (yaklaşık 2 saat), 15-30 dakikalık uzun bir mola (Long Break) ver.</li>
          </ol>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3 font-space">Kimler İçin Uygundur?</h3>
          <p className="mb-4">
            Sınavlara hazırlanan öğrenciler, yazılımcılar, tasarımcılar, yazarlar, home-office çalışanlar ve dikkatini toplamakta zorlanan herkes için idealdir. Bizim aracımız gibi sade bir <strong className="text-foreground font-medium">online pomodoro sayacı</strong> kullanmak, ekstra bir uygulama indirme veya karmaşık ayarlarla uğraşma derdini ortadan kaldırır.
          </p>
        </article>
      </div>
    </div>
  );
}