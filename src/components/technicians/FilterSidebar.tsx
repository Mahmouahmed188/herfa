'use client';

import React, { useState } from 'react';
import { ChevronDown, Star, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-100 dark:border-gray-800 py-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left mb-2 group"
            >
                <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{title}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="space-y-2 pt-2">{children}</div>}
        </div>
    );
};

export default function FilterSidebar({ className = "" }: { className?: string }) {
    const t = useTranslations('ServicesPage');
    const [priceRange, setPriceRange] = useState(100);
    const [distance, setDistance] = useState(25);

    return (
        <aside className={`w-full bg-white dark:bg-[#1A2C22] p-6 rounded-3xl border border-gray-100 dark:border-[#2D4A3A] shadow-sm ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{t('filters')}</h3>
                <button className="text-sm font-bold text-primary hover:underline">{t('clearAll')}</button>
            </div>

            <div className="space-y-2">
                {/* Category Filter */}
                <FilterSection title={t('category')}>
                    {['Electrician', 'Plumber', 'Carpenter', 'Painter', 'HVAC'].map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary bg-transparent" />
                            <span className="text-sm text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{cat}</span>
                        </label>
                    ))}
                </FilterSection>

                {/* Price Range */}
                <FilterSection title={t('priceRange')}>
                    <div className="px-2">
                        <input
                            type="range"
                            min="0"
                            max="500"
                            value={priceRange}
                            onChange={(e) => setPriceRange(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-500">$0</span>
                            <span className="text-sm font-bold text-primary">${priceRange}</span>
                        </div>
                    </div>
                </FilterSection>

                {/* Rating Filter */}
                <FilterSection title={t('rating')}>
                    {[5, 4, 3, 2].map((stars) => (
                        <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary bg-transparent" />
                            <div className="flex items-center gap-1">
                                {[...Array(stars)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                ))}
                                {[...Array(5 - stars)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">{t('andUp')}</span>
                            </div>
                        </label>
                    ))}
                </FilterSection>

                {/* Distance Filter */}
                <FilterSection title={t('distance')}>
                    <div className="px-2">
                        <input
                            type="range"
                            min="1"
                            max="50"
                            value={distance}
                            onChange={(e) => setDistance(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-500">1km</span>
                            <span className="text-sm font-bold text-primary">{distance}km</span>
                        </div>
                    </div>
                </FilterSection>

                {/* Availability Toggle */}
                <div className="py-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{t('availableNow')}</span>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </div>
                    </label>
                </div>
            </div>
        </aside>
    );
}
