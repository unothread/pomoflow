"use client";

import { useI18n } from "../lib/i18n";

export default function LandingSEO() {
  const { t } = useI18n();

  return (
    <div className="w-full bg-card border-y border-card-border py-12 sm:py-20 mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <article className="max-w-none text-muted leading-relaxed">
          
          <h2 className="text-2xl sm:text-3xl mb-4 text-foreground font-semibold font-space">{t("landingTitle1")}</h2>
          <p className="mb-4" dangerouslySetInnerHTML={{ __html: t("landingP1_1") }} />
          <p className="mb-4" dangerouslySetInnerHTML={{ __html: t("landingP1_2") }} />

          <hr className="my-8 border-card-border" />

          <h2 className="text-2xl sm:text-3xl mb-4 text-foreground font-semibold font-space">{t("landingTitle2")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
            <div className="bg-background border border-card-border p-5 rounded-xl">
              <h3 className="font-semibold text-foreground text-lg mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {t("landingFeature1Title")}
              </h3>
              <p className="text-sm">
                {t("landingFeature1Desc")}
              </p>
            </div>
            
            <div className="bg-background border border-card-border p-5 rounded-xl">
              <h3 className="font-semibold text-foreground text-lg mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 Z"/></svg>
                {t("landingFeature2Title")}
              </h3>
              <p className="text-sm">
                {t("landingFeature2Desc")}
              </p>
            </div>

            <div className="bg-background border border-card-border p-5 rounded-xl sm:col-span-2">
              <h3 className="font-semibold text-foreground text-lg mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                {t("landingFeature3Title")}
              </h3>
              <p className="text-sm mb-3">
                {t("landingFeature3Desc")}
              </p>
              <div className="bg-card p-3 rounded-lg border border-card-border/50 text-xs">
                <strong className="text-foreground block mb-1">{t("landingHowToChangeMusic")}</strong>
                {t("landingHowToChangeMusicDesc")}
              </div>
            </div>
          </div>

          <hr className="my-8 border-card-border" />

          <h2 className="text-2xl sm:text-3xl mb-4 text-foreground font-semibold font-space">{t("landingTitle3")}</h2>
          
          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3 font-space">{t("landingSub1")}</h3>
          <p className="mb-4" dangerouslySetInnerHTML={{ __html: t("landingSub1Desc") }} />

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3 font-space">{t("landingSub2")}</h3>
          <ol className="list-decimal pl-5 mb-4 space-y-2">
            <li dangerouslySetInnerHTML={{ __html: t("landingStep1") }} />
            <li dangerouslySetInnerHTML={{ __html: t("landingStep2") }} />
            <li dangerouslySetInnerHTML={{ __html: t("landingStep3") }} />
            <li dangerouslySetInnerHTML={{ __html: t("landingStep4") }} />
            <li dangerouslySetInnerHTML={{ __html: t("landingStep5") }} />
          </ol>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-3 font-space">{t("landingSub3")}</h3>
          <p className="mb-4" dangerouslySetInnerHTML={{ __html: t("landingSub3Desc") }} />
        </article>
      </div>
    </div>
  );
}
