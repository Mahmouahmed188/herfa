'use client';

import { ScanEye, DollarSign, UserSearch, ArrowLeft, MoreVertical } from 'lucide-react';
import Button from "@/components/ui/button";
import { useTranslations } from 'next-intl';

{/* Re-implementing AI Diagnosis based on the rich HTML design */ }
export default function AiDiagnosisSection() {
    const t = useTranslations('AiDiagnosis');
    return (
        <section className="relative flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

            <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-20">
                <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        {/* Text Content */}
                        <div className="flex flex-col gap-8 flex-1">
                            <div className="flex flex-col gap-4 text-start">
                                <span className="text-primary font-bold tracking-wider text-sm uppercase">{t('badge')}</span>
                                <h2 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-black leading-tight"
                                    dangerouslySetInnerHTML={{ __html: t('title') }}
                                />
                                <p className="text-slate-600 dark:text-gray-300 text-lg font-normal leading-relaxed max-w-[600px]">
                                    {t('subtitle')}
                                </p>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="flex gap-4 items-start text-start">
                                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                        <ScanEye className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t('feature1Title')}</h4>
                                        <p className="text-slate-500 dark:text-gray-400">{t('feature1Desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start text-start">
                                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t('feature2Title')}</h4>
                                        <p className="text-slate-500 dark:text-gray-400">{t('feature2Desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start text-start">
                                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                        <UserSearch className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t('feature3Title')}</h4>
                                        <p className="text-slate-500 dark:text-gray-400">{t('feature3Desc')}</p>
                                    </div>
                                </div>
                            </div>
                            <Button className="rounded-full w-fit px-8 h-12">
                                {t('cta')}
                            </Button>
                        </div>

                        {/* Image Content */}
                        <div className="flex-1 w-full flex justify-center lg:justify-end relative">
                            <div className="relative w-[300px] md:w-[350px] aspect-[9/18] border-[8px] border-gray-900 rounded-[3rem] bg-gray-800 shadow-2xl overflow-hidden z-10">
                                {/* Screen Content */}
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDgXceqrqYMR7Am8DD0ommstBaIqJArD1qlBWma5eHHqKASrHto_DTo3ylaLcVBU-f2lY1o595PtAwwTWyK1qCfOn8kanMmaEmge_uadtiytK3_dS6gCCPq0CiwlCjRFQ4pRbRh92q0Al-2MHPdHDQN3ptD1EKfhfq5Rfj8i2cFFFhGv-WkNfZ_qlZ79ZJZWyu-4OZ9wAzXgCfydEkuMS4fENrkt7YDKrx_PcVMnEayqNPGzjIpwwUrEpYmo3xIujYeyfrJzfK7KLA")' }}>
                                    {/* UI Overlay on Phone */}
                                    <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-6">
                                        <div className="w-full flex justify-between items-center text-white mt-8">
                                            <ArrowLeft className="cursor-pointer w-6 h-6 rtl:rotate-180" />
                                            <span className="font-bold">{t('scanResult')}</span>
                                            <MoreVertical className="cursor-pointer w-6 h-6" />
                                        </div>
                                        {/* Scan Box */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary/70 rounded-lg flex items-center justify-center">
                                            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary -mt-1 -ml-1"></div>
                                            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary -mt-1 -mr-1"></div>
                                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary -mb-1 -ml-1"></div>
                                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary -mb-1 -mr-1"></div>
                                            <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-bold animate-pulse">
                                                {t('scanning')}
                                            </div>
                                        </div>
                                        {/* Bottom Sheet */}
                                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-4 shadow-lg animate-in slide-in-from-bottom duration-700 mb-4 text-start">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="size-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                                                    <span className="text-xl">⚠️</span>
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">{t('issueTitle')}</h5>
                                                    <p className="text-xs text-slate-500">{t('severity')}</p>
                                                </div>
                                            </div>
                                            <button className="w-full py-2 bg-primary rounded-lg text-background-dark font-bold text-xs">{t('findSpecialist')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Background card for depth */}
                            <div className="absolute -right-4 top-12 w-[300px] h-[500px] bg-surface-border rounded-[2.5rem] -z-0 rotate-3 opacity-50 hidden md:block"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
