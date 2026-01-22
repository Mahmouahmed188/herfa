'use client';

import { ArrowRight, Star } from 'lucide-react';

const technicians = [
    {
        name: "Ahmed H.",
        title: "Electrical Engineer",
        rating: "4.9",
        reviews: "124",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZjQonIH3a-D03DzTjyLxRVdj8h_mOC9uQuZ_2eyw9lYHZH3ybvCl_w06OmfPT-vhAJd_BZAqrukCuqjRPjvB4CwSovBgVXdqGcErZu7uxBdYr1EMtVDAceg1LmDLC5BdRo6mird4hE7agG2pne_LwHcyuZ1zgTWbUFb9Wr5mtEOLCBqQr9xrQSVQSeKNVBdxObo8iSMXWbT2CpfJC_3J8VcPU_B7GPFEK__fDr-_2t0DFQSnrE99d7CLM3gaitRN1R72bi2mNZq8",
        tags: ["Wiring", "Installations"]
    },
    {
        name: "Sarah J.",
        title: "Civil Engineer",
        rating: "4.8",
        reviews: "89",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZeBPhLaYOv_WKAvfRtlSbfjHHJKanQzYK24hrMHGowUuyIkEv6SdbnFrxBPo-KBR9ly7BOgvy6StG1WDXu8EOJejkL5dOCJdcH3t-UHLNFgFO43qlSiVXqIRplZzc3Vv1H1gn_SX0LRWDC8kftQYFHPVFTjnNNObxC3Dw6RJAh2wwq0SR3UbNV_R84_RH3zY1uLXYz1_hOsMVt3xVxkN5Hf8sPzWTbwVgIKlxlFuwABlXhZzjRdABlsZbUbC2NJFkjrEVZFXhM2I",
        tags: ["Structural", "Design"]
    },
    {
        name: "Mike C.",
        title: "HVAC Specialist",
        rating: "5.0",
        reviews: "210",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBaJEh8Rhzxn2ZCIl2YhkZ9_m0rmT2pn5uMBScqdjuF6S0V8xEj7kxZlTL-dqQguEnH2X_FRgsnF3bjYYad1Yef2i3X_S2sj4Ge9Vb3M2AJb2QwC0RMP3874wMsBlv-7zyNWLcoh1a6FAlvTqdZ3JgeF-mYWHQrtU9eLFcCxMs6EVMQhFknW7JwkWr_Bj8R_nLgQ_04Ct7LMmKuu4tjmFmUU2-nfDxkHEVd4gM7Mh1o0K4fTvTFPrwbjpd7E8xZTZu2wPeDffovWFc",
        tags: ["AC Repair", "Heating"]
    },
    {
        name: "David M.",
        title: "Plumbing Expert",
        rating: "4.7",
        reviews: "156",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAFwDRTuvb_zvDxF_0reqR1Luhxu0U0Ri2pbdUHw7EMa8GUoQNaghk3sBQX91-noVqkVGEWq7RRNCHSRaHi9g460D8sZS2K1RV7fbjqruYbnIr8IeJHz50loVg2xZWwTeTFRHBsUrclkXm1Q2b_3vG17sCWsC-uX0Em7gtqFKkSlbagN0kIE-0BLYSEJiDoPIBQwBTub3z5cHsNLdMv55Fn7UWe4F94vxwhcoJmEbM6-ZAhDoZZimQ1xMdCjr8GNPmifOTBuZrGqY",
        tags: ["Repairs", "Installation"]
    }
];

export function Technicians() {
    return (
        <section className="relative flex flex-col bg-gray-50 dark:bg-[#151a14]">
            <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-20">
                <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 px-4">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight">Trusted Technicians</h2>
                            <p className="text-slate-500 dark:text-gray-400">Verified professionals ready for your next project.</p>
                        </div>
                        <a className="text-primary font-bold hover:underline flex items-center gap-1" href="#">
                            View All Experts <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                        {technicians.map((tech, i) => (
                            <div key={i} className="group flex flex-col gap-4 rounded-3xl border border-gray-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6 transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${tech.image}")` }}></div>
                                    <div>
                                        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">{tech.name}</h3>
                                        <p className="text-primary text-sm font-medium">{tech.title}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-400/10 w-fit px-2 py-1 rounded-lg">
                                    <Star className="text-yellow-400 text-sm fill-current" />
                                    <span className="text-slate-700 dark:text-gray-200 text-sm font-bold">{tech.rating}</span>
                                    <span className="text-slate-400 text-xs">({tech.reviews} reviews)</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {tech.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-background-dark text-xs font-medium text-slate-600 dark:text-gray-400">{tag}</span>
                                    ))}
                                </div>
                                <button className="w-full mt-auto py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">View Profile</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
