'use client';

import { Smartphone, Tablet } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

/* Re-implementing App Download based on the rich HTML design */
export default function AppDownloadSection() {
  const t = useTranslations('AppDownload');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <section className="relative flex flex-col bg-background-light dark:bg-background-dark py-20">
      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 rounded-[3rem] overflow-hidden relative">
          <div
            className="absolute inset-0 bg-surface-dark bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1zJg6FK4tAsCnHQlxKT1HPVcLb-C5-Iv315hpF9aizXJsMY_JWFk07-Fr0TFWJTp5H9mGL3lYQY8IdbfbRvyzYOBYFQVhecdgnjqLbMF2rPLFtB5AX4x6e-rp5CD133EhkY7ivRDtJJJT6AKasFWJ8P2_dKEzWbDuO3NseaI9-plWivtuOdOsgDJjhmMN3uBFQ6uY2PKvF3ytXz2PBr0gE7sKutQWrJmt3r0a8G_yFCP8_myRo8Fi-NLHG_U7995OhC5UlTj7UnY")',
              opacity: 0.2,
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark to-background-dark/80"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-16 gap-10">
            <div className="flex flex-col gap-6 max-w-[500px] text-center md:text-start">
              <h2 className="text-white text-3xl md:text-5xl font-black leading-tight">
                {t('title')}
              </h2>
              <p className="text-gray-300 text-lg">{t('subtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors w-fit mx-auto sm:mx-0">
                  <div className="flex items-center justify-center">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {t('getItOn')}
                    </span>
                    <span className="text-lg font-bold">{t('googlePlay')}</span>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-transparent border border-white/30 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition-colors w-fit mx-auto sm:mx-0">
                  <div className="flex items-center justify-center">
                    <Tablet className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {t('downloadOn')}
                    </span>
                    <span className="text-lg font-bold">{t('appStore')}</span>
                  </div>
                </button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="bg-white p-4 rounded-2xl shadow-2xl">
                <img
                  alt="QR Code to download app"
                  className="w-32 h-32"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2XuQgsBqx4HQOhxWgGSAzJHnhhlko_VkOb91DqHwUW1z0Uxq3Un5m-mshjsDccnQp-gDzxxNZf22G6qfYNNJtDruokbocrWchleQMLu899sZKw4VNuDfbiu17ZyT33XTwmLqsaG4Em860DXlFL620g-FWRKNs4aj2-ZoN3FQC3zoO_AjrOk2FYlIzSoK4Qqt9eowQyqa2bW-iIf9czyXqJw-JxUiqulGXxByZbDz-g-joEbC_4SBnjASHkS15zS_xSECXubEPfX8"
                />
                <p className="text-center text-xs font-bold mt-2 text-slate-800">
                  {t('scanToDownload')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
