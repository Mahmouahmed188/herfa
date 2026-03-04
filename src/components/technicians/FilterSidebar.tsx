'use client';

import React, { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-white/10 py-5 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left mb-4 group"
            >
                <span className="text-[10px] tracking-widest font-black text-gray-500 group-hover:text-primary transition-colors">{title}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="space-y-3">{children}</div>}
        </div>
    );
};

export default function FilterSidebar({ className = "" }: { className?: string }) {
    const t = useTranslations('Services');
    const [priceRange, setPriceRange] = useState(100);
    const [distance, setDistance] = useState(25);

    return (
        <aside className={`w-full bg-[#1A2C22]/60 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-xl ${className}`}>
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-extrabold text-white">{t('filters')}</h3>
                <button className="text-sm font-bold text-primary hover:underline transition-all">
                    {t('resetAll')}
                </button>
            </div>

            <div className="space-y-2">
                {/* Category Filter */}
                <FilterSection title={t('category')}>
                    {['All Categories', 'Plumbing', 'Carpentry', 'Electrical', 'Painting'].map((cat, idx) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    defaultChecked={idx === 1}
                                    className="peer appearance-none w-5 h-5 rounded-md border-2 border-white/10 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                                    <svg className="w-3 h-3 text-background-dark stroke-[4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                                {cat}
                            </span>
                        </label>
                    ))}
                </FilterSection>

                {/* Price Range */}
                <FilterSection title={t('hourlyRate')}>
                    <div className="px-1">
                        <input
                            type="range"
                            min="10"
                            max="500"
                            value={priceRange}
                            onChange={(e) => setPriceRange(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-500 uppercase">
                            <span>$10</span>
                            <span className="text-primary">${priceRange}+</span>
                            <span>$500+</span>
                        </div>
                    </div>
                </FilterSection>

                {/* Rating Filter */}
                <FilterSection title={t('rating')}>
                    {[5, 4, 3, 2].map((stars) => (
                        <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                            <input type="radio" name="rating" className="w-5 h-5 appearance-none border-2 border-white/10 rounded-full checked:border-primary checked:border-[6px] transition-all cursor-pointer" />
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-gray-200 mr-1">{stars}.0</span>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < stars ? 'fill-primary text-primary' : 'text-white/10'}`} />
                                ))}
                            </div>
                        </label>
                    ))}
                </FilterSection>

                {/* Distance Filter */}
                <FilterSection title={t('distance')}>
                    <div className="px-1">
                        <input
                            type="range"
                            min="5"
                            max="50"
                            value={distance}
                            onChange={(e) => setDistance(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-500 uppercase">
                            <span>5mi</span>
                            <span className="text-primary">{distance}mi+</span>
                            <span>50mi+</span>
                        </div>
                    </div>
                </FilterSection>
            </div>
        </aside>
    );
}
