'use client';

import React, { useState, useCallback } from 'react';
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

export interface FilterValues {
    categories: string[];
    maxPrice: number;
    minRating: number | null;
    maxDistance: number;
    availableOnly: boolean;
}

interface FilterSidebarProps {
    className?: string;
    onFilterChange?: (filters: FilterValues) => void;
    initialValues?: Partial<FilterValues>;
}

const CATEGORIES = ['Plumbing', 'Carpentry', 'Electrical', 'Painting', 'HVAC', 'Cleaning'];

const DEFAULT_FILTERS: FilterValues = {
    categories: [],
    maxPrice: 500,
    minRating: null,
    maxDistance: 50,
    availableOnly: false,
};

export default function FilterSidebar({ className = '', onFilterChange, initialValues }: FilterSidebarProps) {
    const t = useTranslations('Services');

    const [filters, setFilters] = useState<FilterValues>({
        ...DEFAULT_FILTERS,
        ...initialValues,
    });

    const updateFilters = useCallback((partial: Partial<FilterValues>) => {
        setFilters((prev) => {
            const next = { ...prev, ...partial };
            onFilterChange?.(next);
            return next;
        });
    }, [onFilterChange]);

    const toggleCategory = (cat: string) => {
        const updated = filters.categories.includes(cat)
            ? filters.categories.filter((c) => c !== cat)
            : [...filters.categories, cat];
        updateFilters({ categories: updated });
    };

    const handleReset = () => {
        setFilters(DEFAULT_FILTERS);
        onFilterChange?.(DEFAULT_FILTERS);
    };

    return (
        <aside className={`w-full bg-[#1A2C22]/60 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-xl ${className}`}>
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-extrabold text-white">{t('filters')}</h3>
                <button
                    onClick={handleReset}
                    className="text-sm font-bold text-primary hover:underline transition-all"
                >
                    {t('resetAll')}
                </button>
            </div>

            <div className="space-y-2">
                {/* Category Filter */}
                <FilterSection title={t('category')}>
                    {CATEGORIES.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={filters.categories.includes(cat)}
                                    onChange={() => toggleCategory(cat)}
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

                {/* Availability Filter */}
                <FilterSection title="Availability">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={filters.availableOnly}
                                onChange={(e) => updateFilters({ availableOnly: e.target.checked })}
                                className="peer appearance-none w-5 h-5 rounded-md border-2 border-white/10 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                                <svg className="w-3 h-3 text-background-dark stroke-[4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                            Available Now Only
                        </span>
                    </label>
                </FilterSection>

                {/* Price Range */}
                <FilterSection title={t('hourlyRate')}>
                    <div className="px-1">
                        <input
                            type="range"
                            min="10"
                            max="500"
                            value={filters.maxPrice}
                            onChange={(e) => updateFilters({ maxPrice: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-500 uppercase">
                            <span>$10</span>
                            <span className="text-primary">${filters.maxPrice}+</span>
                            <span>$500+</span>
                        </div>
                    </div>
                </FilterSection>

                {/* Rating Filter */}
                <FilterSection title={t('rating')}>
                    {[5, 4, 3, 2].map((stars) => (
                        <label key={stars} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="rating"
                                checked={filters.minRating === stars}
                                onChange={() => updateFilters({ minRating: stars })}
                                className="w-5 h-5 appearance-none border-2 border-white/10 rounded-full checked:border-primary checked:border-[6px] transition-all cursor-pointer"
                            />
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-gray-200 mr-1">{stars}.0+</span>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3 h-3 ${i < stars ? 'fill-primary text-primary' : 'text-white/10'}`} />
                                ))}
                            </div>
                        </label>
                    ))}
                    {filters.minRating !== null && (
                        <button
                            onClick={() => updateFilters({ minRating: null })}
                            className="text-xs text-gray-500 hover:text-primary transition-colors mt-1"
                        >
                            Clear rating
                        </button>
                    )}
                </FilterSection>

                {/* Distance Filter */}
                <FilterSection title={t('distance')}>
                    <div className="px-1">
                        <input
                            type="range"
                            min="5"
                            max="100"
                            value={filters.maxDistance}
                            onChange={(e) => updateFilters({ maxDistance: parseInt(e.target.value) })}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between mt-3 text-[10px] font-bold text-gray-500 uppercase">
                            <span>5km</span>
                            <span className="text-primary">{filters.maxDistance}km</span>
                            <span>100km</span>
                        </div>
                    </div>
                </FilterSection>
            </div>
        </aside>
    );
}
