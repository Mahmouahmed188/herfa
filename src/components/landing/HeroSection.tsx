'use client';

import { motion } from 'framer-motion';
import { Download, CheckCircle, Star, Verified } from 'lucide-react';
import Button from "@/components/ui/button";
import { useTranslations } from 'next-intl';

{/* Re-implementing Hero Section based on the rich HTML design */ }
export default function HeroSection() {
    const t = useTranslations('Hero');
    return (
        <section className="relative flex flex-col bg-background-light dark:bg-background-dark">
            <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
                <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
                    <div className="@container">
                        <div className="flex flex-col-reverse gap-6 px-4 py-10 @[864px]:flex-row @[864px]:items-center">
                            <div className="flex flex-col gap-8 @[480px]:min-w-[400px] flex-1">
                                <div className="flex flex-col gap-4 text-start">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-surface-border bg-white dark:bg-surface-dark px-3 py-1 w-fit">
                                        <Verified className="text-primary w-4 h-4" />
                                        <span className="text-xs font-bold text-slate-600 dark:text-gray-300">{t('certified')}</span>
                                    </div>
                                    <h1 className="text-slate-900 dark:text-white text-4xl font-extrabold leading-tight tracking-[-0.033em] @[480px]:text-6xl"
                                        dangerouslySetInnerHTML={{ __html: t('title') }}
                                    />
                                    <h2 className="text-slate-600 dark:text-gray-300 text-lg font-medium leading-relaxed max-w-[600px]">
                                        {t('subtitle')}
                                    </h2>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <Button className="rounded-full h-12 px-6">{t('cta')}</Button>
                                    <Button variant="outline" className="rounded-full h-12 px-6">
                                        <Download className="w-5 h-5 mr-2" />
                                        {t('download')}
                                    </Button>
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="flex -space-x-4">
                                        <div className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-tlB6j2X66sq-VfjjyU-NfL7utkW4flZRUCpPE4qWqU24PoKCjUfAEtYO-wlVSikcDPOzMdQjcn7OjM3BWMOefyw3AG0wvq0u26tN0TYXbB7tjYxGA1e-RWyLSK_H09p7uOjqutXAeBBGqUAZtjbR6I2qsQMkkhOtL1Am-sisw27_dzf1r1AFoev53FxzJ906XLjjkoh9kH5mOutxOUfwZ6pe18BKBuxxt08A5kT4_TFNTgwDMRi5iFcDIG3WNTbF3pcz9hkzEtc")' }}></div>
                                        <div className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDhZRRL4OOUMXdTjFt0_jL_XU6uMyTQ98xTrCRxBqwnWB9GYJnkjxF9XPpYImgg3x4yBLv2IEDXbtWfU4G81tXgbmMrF-WX9hwRBnUW9iVVcFUgrobZGxNxF_2WEdveG8EmY4uswpKUEMsv2_Zj7UNfDOsNFzaNVZk5uGGPiCxwzXbs8PTS-uMMwNKJek95PGBx3EEDBnzkfM6k-CP8X0P-opGFT0KIYwieLMTFzbRMilKDuQVInULvY91vJDDII2q9E417EN2h_MI")' }}></div>
                                        <div className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBTMqH2yOSqhaLyKRuu9iowORlsPx37mp0iWsGnONR4O2r5niKl_ElV5d4WtxRMtIAdPjj4cXUKfJOvo47OZTl99NtIKoS61halMSIpEOaXlpEpPTSZq21muRHaDsshpgehs2p57D4V4GAj01wF_KrCvKN-WmqQ2JLK_xhBZJygZsXM_wgdpn3BipHK_ym6UOX6JgqKaRpY8_raBPbc2ux_To1XeVXw5_5dTNSlInMmD1kvsQhAmn4S4mb3iEMRRFhTgvtSVPB342k")' }}></div>
                                        <div className="size-10 rounded-full border-2 border-background-light dark:border-background-dark bg-primary flex items-center justify-center text-xs font-bold text-background-dark">
                                            +2k
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                                        </div>
                                        <span className="text-xs font-medium text-slate-500 dark:text-gray-400">{t('trusted')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-surface-dark flex-1 relative group">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuALBA0QbzduzJy-CFuSRfThdCkY-Apo404DCi7IwSeBLne9JXYWm7tjHN4U2KDc3ANNbl2CRDrtvzuHnngNxdCzMPkeMRG-FjuGxQ5S-7HahticMyuhJw6OEBwhGt0shGI2QEaFTQkqhZ3JeipDxJofKqyilQeDn_x76OROs34jfS3zZ8eVctbmoKx7HvucjccPtXhzRvCJ3meXSrpG8RRAdcObzYY3SynetRUg1nIXw61KHO_wnfV4Vk0boNugn1oe601qqC88JHs")' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
                                {/* Floating Card Overlay */}
                                <div className="absolute bottom-6 left-6 right-6 bg-background-light/90 dark:bg-surface-dark/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 shadow-lg">
                                    <div className="bg-primary/20 p-3 rounded-full text-primary">
                                        <Verified className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-slate-900 dark:text-white font-bold text-sm">{t('inspectionStatus')}</p>
                                        <p className="text-slate-500 dark:text-gray-400 text-xs">{t('inspectionTime')}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <CheckCircle className="text-primary w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
