'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, MapPin, ChevronDown, SlidersHorizontal, X, Zap, Wrench, Paintbrush, Hammer, Thermometer } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import TechnicianResultCard, { TechnicianProps } from '@/components/technicians/TechnicianResultCard';
import FilterSidebar, { FilterValues } from '@/components/technicians/FilterSidebar';
import Button from '@/components/ui/button';
import * as api from '@/services/api';

const MOCK_TECHNICIANS: TechnicianProps[] = [
    {
        id: '1',
        name: 'Alex Johnson',
        title: 'Master Electrician',
        rating: 4.9,
        reviews: 128,
        hourlyRate: 45,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 98,
        skills: ['Residential', 'Smart Home', 'Electrical'],
        verified: true,
        available: true,
        experience: '12 Years XP',
        location: 'Nasr City, Cairo',
        description: 'Specialized in smart home installations and complex residential wiring. Certified master electrician.'
    },
    {
        id: '4',
        name: 'Emily Wilson',
        title: 'Plumbing Expert',
        rating: 4.7,
        reviews: 84,
        hourlyRate: 40,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 88,
        skills: ['Pipe Repair', 'Installation', 'Plumbing'],
        verified: false,
        available: true,
        experience: '6 Years XP',
        location: 'Zamalek, Cairo',
        description: 'Dependable plumbing services for leak detection and pipe replacement. Available 24/7.'
    },
    {
        id: '5',
        name: 'David Miller',
        title: 'Carpenter',
        rating: 4.9,
        reviews: 156,
        hourlyRate: 50,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 85,
        skills: ['Custom Furniture', 'Flooring', 'Carpentry'],
        verified: true,
        available: false,
        experience: '10 Years XP',
        location: 'Heliopolis, Cairo',
        description: 'Master craftsman specializing in custom furniture and flooring installation.'
    },
    {
        id: '3',
        name: 'Michael Chen',
        title: 'HVAC Specialist',
        rating: 5.0,
        reviews: 210,
        hourlyRate: 55,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 92,
        skills: ['AC Repair', 'Heating', 'HVAC'],
        verified: true,
        available: true,
        experience: '15 Years XP',
        location: 'New Cairo, Egypt',
        description: 'Expert in all types of heating and cooling systems for residential buildings.'
    },
    {
        id: '2',
        name: 'Sarah Davis',
        title: 'Interior Designer',
        rating: 4.8,
        reviews: 95,
        hourlyRate: 60,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 95,
        skills: ['Modern', 'Renovation', 'Painting'],
        verified: true,
        available: false,
        experience: '8 Years XP',
        location: 'Maadi, Cairo',
        description: 'Creating modern, functional spaces tailored to your lifestyle and renovations.'
    },
    {
        id: '6',
        name: 'Omar Khalid',
        title: 'Painting Specialist',
        rating: 4.6,
        reviews: 67,
        hourlyRate: 35,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 80,
        skills: ['Interior Painting', 'Exterior', 'Painting'],
        verified: true,
        available: true,
        experience: '5 Years XP',
        location: 'Giza, Egypt',
        description: 'Professional painter specializing in interior and exterior paint jobs with premium materials.'
    },
];

const CATEGORY_ICONS = [
    { name: 'Plumbing', icon: Wrench, color: 'text-blue-400' },
    { name: 'Carpentry', icon: Hammer, color: 'text-amber-400' },
    { name: 'Electrical', icon: Zap, color: 'text-yellow-400' },
    { name: 'Painting', icon: Paintbrush, color: 'text-purple-400' },
    { name: 'HVAC', icon: Thermometer, color: 'text-cyan-400' },
];

type SortOption = 'recommended' | 'rating' | 'price_asc' | 'price_desc' | 'reviews';

const SORT_LABELS: Record<SortOption, string> = {
    recommended: 'Recommended',
    rating: 'Top Rated',
    price_asc: 'Price: Low to High',
    price_desc: 'Price: High to Low',
    reviews: 'Most Reviews',
};

export default function ServicesAndCategoriesPage() {
    const locale = useLocale();
    const t = useTranslations('Services');
    const isRtl = locale === 'ar';

    const [searchTerm, setSearchTerm] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('recommended');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const sortRef = useRef<HTMLDivElement>(null);

    const [allTechnicians, setAllTechnicians] = useState<TechnicianProps[]>(MOCK_TECHNICIANS);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<FilterValues>({
        categories: [],
        maxPrice: 500,
        minRating: null,
        maxDistance: 50,
        availableOnly: false,
    });

    // Close sort dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Fetch technicians from backend
    useEffect(() => {
        async function fetchTechnicians() {
            setIsLoading(true);
            try {
                const res = await api.searchProviders({
                    isAvailable: filters.availableOnly || undefined,
                    maxPrice: filters.maxPrice < 500 ? filters.maxPrice : undefined,
                });
                if (res && Array.isArray(res) && res.length > 0) {
                    const mapped: TechnicianProps[] = res.map((p: any) => ({
                        id: p.id || p.userId,
                        name: p.user?.firstName
                            ? `${p.user.firstName} ${p.user.lastName || ''}`.trim()
                            : p.businessName || p.user?.email?.split('@')[0] || 'Unknown',
                        title: p.services?.[0]?.service?.name || p.businessName || 'Technician',
                        rating: parseFloat(p.rating) || 4.5,
                        reviews: p.totalJobsCompleted || 0,
                        hourlyRate: p.services?.[0]?.price || 50,
                        image: p.profileImage || p.user?.profileImage ||
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
                        matchPercentage: 90,
                        skills: p.services?.map((s: any) => s.service?.name).filter(Boolean) || ['General'],
                        verified: p.verificationStatus === 'verified',
                        available: p.isAvailable || false,
                        experience: `${p.totalJobsCompleted || 0} Jobs`,
                        location: p.address || 'Location not set',
                        description: p.bio || p.businessDescription || 'Professional technician ready to help.',
                    }));
                    setAllTechnicians(mapped);
                }
            } catch (err) {
                console.error('Failed to load technicians from API, using mock data:', err);
                // Keep mock data as fallback
            } finally {
                setIsLoading(false);
            }
        }
        fetchTechnicians();
    }, [filters.availableOnly]);

    const handleFilterChange = useCallback((newFilters: FilterValues) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    // Client-side filtering + sorting
    const filteredAndSorted = useMemo(() => {
        let result = [...allTechnicians];

        // Search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter((t) =>
                t.name.toLowerCase().includes(term) ||
                t.title.toLowerCase().includes(term) ||
                t.skills.some((s) => s.toLowerCase().includes(term)) ||
                t.description?.toLowerCase().includes(term)
            );
        }

        // Active category (from icon buttons)
        const activeCategories = activeCategory
            ? [activeCategory]
            : filters.categories;

        if (activeCategories.length > 0) {
            result = result.filter((t) =>
                t.skills.some((s) =>
                    activeCategories.some((cat) => s.toLowerCase().includes(cat.toLowerCase()))
                ) || activeCategories.some((cat) => t.title.toLowerCase().includes(cat.toLowerCase()))
            );
        }

        // Availability
        if (filters.availableOnly) {
            result = result.filter((t) => t.available === true);
        }

        // Rating
        if (filters.minRating !== null) {
            result = result.filter((t) => t.rating >= filters.minRating!);
        }

        // Price
        if (filters.maxPrice < 500) {
            result = result.filter((t) => t.hourlyRate <= filters.maxPrice);
        }

        // Sorting
        switch (sortBy) {
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'price_asc':
                result.sort((a, b) => a.hourlyRate - b.hourlyRate);
                break;
            case 'price_desc':
                result.sort((a, b) => b.hourlyRate - a.hourlyRate);
                break;
            case 'reviews':
                result.sort((a, b) => b.reviews - a.reviews);
                break;
            default: // recommended: by matchPercentage then rating
                result.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0) || b.rating - a.rating);
        }

        return result;
    }, [allTechnicians, searchTerm, filters, activeCategory, sortBy]);

    const ITEMS_PER_PAGE = 6;
    const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / ITEMS_PER_PAGE));
    const paginated = filteredAndSorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSearch = () => {
        setCurrentPage(1);
    };

    const handleCategoryClick = (cat: string) => {
        setActiveCategory((prev) => (prev === cat ? null : cat));
        setCurrentPage(1);
    };

    return (
        <div className="bg-[#0A0F0D] min-h-screen text-white font-sans selection:bg-primary/30">
            {/* HERO SECTION */}
            <div className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12)_0%,transparent_70%)] pointer-events-none"></div>

                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        {t.rich('title', {
                            highlight: (chunks) => <span className="text-primary">{chunks}</span>
                        })}
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        {t('subtitle')}
                    </p>

                    {/* SEARCH BAR */}
                    <div className="flex flex-col md:flex-row items-center bg-[#1A2C22] rounded-2xl md:rounded-full border border-white/10 p-2 shadow-2xl max-w-3xl mx-auto backdrop-blur-md group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <div className="flex-1 flex items-center px-5 py-3 w-full">
                            <Search className="w-5 h-5 text-primary mr-3 rtl:ml-3 rtl:mr-0 shrink-0" />
                            <input
                                type="text"
                                placeholder={t('searchPlaceholder')}
                                className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-base"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="ml-2 text-gray-500 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <div className="hidden md:block w-px h-8 bg-white/10 mx-2"></div>
                        <div className="flex-[0.5] flex items-center px-5 py-3 w-full border-t md:border-t-0 border-white/10">
                            <MapPin className="w-5 h-5 text-primary mr-3 rtl:ml-3 rtl:mr-0 shrink-0" />
                            <input
                                type="text"
                                placeholder={t('zipCodePlaceholder')}
                                className="bg-transparent w-full outline-none text-white placeholder-gray-500 text-base"
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="w-full md:w-auto rounded-xl md:rounded-full px-10 py-4 h-auto text-base font-extrabold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
                        >
                            {t('search')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="container mx-auto max-w-7xl px-6 pt-24 pb-32">
                <div className={`flex flex-col lg:flex-row gap-16 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>

                    {/* SIDEBAR */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <FilterSidebar onFilterChange={handleFilterChange} />
                    </aside>

                    {/* CONTENT */}
                    <main className="flex-1 min-w-0">
                        {/* Page Controls */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                            <div className="flex items-center gap-6 flex-wrap">
                                <h2 className="text-xl font-bold text-white/90">
                                    {isLoading
                                        ? 'Loading...'
                                        : t('resultsFound', { count: filteredAndSorted.length })}
                                </h2>

                                {/* Quick Category Icon Filters */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    {CATEGORY_ICONS.map((cat) => (
                                        <button
                                            key={cat.name}
                                            onClick={() => handleCategoryClick(cat.name)}
                                            title={cat.name}
                                            className={`p-3 rounded-full border transition-all group ${
                                                activeCategory === cat.name
                                                    ? 'bg-primary/20 border-primary/50'
                                                    : 'bg-[#1A2C22] border-white/5 hover:border-primary/50 hover:bg-primary/10'
                                            }`}
                                        >
                                            <cat.icon className={`w-5 h-5 ${cat.color} group-hover:scale-110 transition-transform`} />
                                        </button>
                                    ))}
                                    {activeCategory && (
                                        <button
                                            onClick={() => setActiveCategory(null)}
                                            className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
                                        >
                                            <X className="w-3 h-3" /> Clear
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                {/* Sort Dropdown */}
                                <div className="relative" ref={sortRef}>
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="flex items-center gap-2 bg-[#1A2C22] border border-white/10 px-4 py-2.5 rounded-xl text-sm transition-all hover:border-primary/30 whitespace-nowrap"
                                    >
                                        <span className="text-gray-400">{t('sortBy')}:</span>
                                        <span className="font-bold text-white">{SORT_LABELS[sortBy]}</span>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isSortOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-52 bg-[#1A2C22] border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden">
                                            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => { setSortBy(option); setIsSortOpen(false); setCurrentPage(1); }}
                                                    className={`w-full text-left px-5 py-3 text-sm transition-colors ${
                                                        sortBy === option
                                                            ? 'text-primary font-bold bg-primary/10'
                                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                                    }`}
                                                >
                                                    {SORT_LABELS[option]}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="lg:hidden flex items-center gap-2 bg-primary px-4 py-2.5 rounded-xl text-sm font-bold text-background-dark shadow-lg shadow-primary/20"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    {t('filters')}
                                </button>
                            </div>
                        </div>

                        {/* TECHNICIAN GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {isLoading ? (
                                // Skeleton loading
                                [...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-[#1A2C22] border border-white/5 rounded-[32px] overflow-hidden animate-pulse">
                                        <div className="aspect-[4/3] bg-white/5" />
                                        <div className="p-6 space-y-3">
                                            <div className="h-5 bg-white/5 rounded-lg w-3/4" />
                                            <div className="h-4 bg-white/5 rounded-lg w-1/2" />
                                            <div className="h-4 bg-white/5 rounded-lg w-full" />
                                            <div className="h-4 bg-white/5 rounded-lg w-5/6" />
                                        </div>
                                    </div>
                                ))
                            ) : paginated.length > 0 ? (
                                paginated.map((tech) => (
                                    <TechnicianResultCard key={tech.id} tech={tech} />
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4 text-center">
                                    <div className="w-16 h-16 rounded-full bg-[#1A2C22] flex items-center justify-center">
                                        <Search className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-400">No technicians found</h3>
                                    <p className="text-gray-600 max-w-sm">Try adjusting your search terms or filters to find more results.</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm('');
                                            setActiveCategory(null);
                                            setFilters({ categories: [], maxPrice: 500, minRating: null, maxDistance: 50, availableOnly: false });
                                            setCurrentPage(1);
                                        }}
                                        className="border-white/10 mt-2"
                                    >
                                        Clear All Filters
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {!isLoading && totalPages > 1 && (
                            <div className="mt-16 flex justify-center">
                                <div className="flex items-center gap-2 bg-[#1A2C22] p-1.5 rounded-full border border-white/5">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => { setCurrentPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                                                n === currentPage
                                                    ? 'bg-primary text-background-dark shadow-inner shadow-black/20'
                                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* MOBILE FILTER DRAWER */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
                    <div className={`absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto bg-[#0E1512] border-t border-white/10 rounded-t-[40px] p-8 shadow-2xl`}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold">{t('filters')}</h3>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full bg-[#1A2C22] hover:bg-white/10 transition-colors">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                        <FilterSidebar
                            className="!border-none !p-0 !bg-transparent"
                            onFilterChange={handleFilterChange}
                        />
                        <div className="mt-10 grid grid-cols-2 gap-4">
                            <Button variant="outline" className="rounded-xl py-4 h-auto font-bold border-white/10" onClick={() => setIsFilterOpen(false)}>
                                {isRtl ? 'إلغاء' : 'Cancel'}
                            </Button>
                            <Button className="rounded-xl py-4 h-auto font-bold" onClick={() => setIsFilterOpen(false)}>
                                {isRtl ? 'تطبيق' : 'Apply Filters'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
