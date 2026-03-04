'use client';

import React, { useState } from 'react';
import { Search, MapPin, Filter, Bell, ChevronDown, Grid, List, SlidersHorizontal, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import TechnicianResultCard, { TechnicianProps } from '@/components/technicians/TechnicianResultCard';
import FilterSidebar from '@/components/technicians/FilterSidebar';
import Button from '@/components/ui/button';

// Enhanced Mock Data
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
        skills: ['Residential', 'Smart Home', 'Wiring'],
        verified: true,
        available: true,
        experience: '12 Years XP',
        location: 'Nasr City, Cairo',
        description: 'Specialized in smart home installations and complex residential wiring. Certified master electrician with a focus on safety and efficiency.'
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
        skills: ['Modern', 'Renovation', '3D Modeling'],
        verified: true,
        available: false,
        experience: '8 Years XP',
        location: 'Maadi, Cairo',
        description: 'Creating modern, functional spaces tailored to your lifestyle. Specialist in residential renovations and advanced 3D spatial modeling.'
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
        skills: ['AC Repair', 'Heating', 'Installation'],
        verified: true,
        available: true,
        experience: '15 Years XP',
        location: 'New Cairo, Egypt',
        description: 'Expert in all types of heating and cooling systems. From emergency repairs to complete unit installations for residential and commercial buildings.'
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
        skills: ['Pipe Repair', 'Installation', 'Emergency'],
        verified: false,
        available: true,
        experience: '6 Years XP',
        location: 'Zamalek, Cairo',
        description: 'Dependable plumbing services for leak detection, pipe replacement, and efficient fixture installation. Available for 24/7 emergency calls.'
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
        skills: ['Custom Furniture', 'Flooring', 'Repair'],
        verified: true,
        available: false,
        experience: '10 Years XP',
        location: 'Heliopolis, Cairo',
        description: 'Master craftsman specializing in custom hardwood furniture, flooring installation, and detailed architectural woodwork.'
    }
];

export default function ServicesAndCategoriesPage() {
    const locale = useLocale();
    const t = useTranslations('ServicesPage');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const isRtl = locale === 'ar';

    return (
        <div className="bg-[#0E1512] min-h-screen text-white font-sans selection:bg-primary/30 pb-20">
            {/* Top Search Header - Sticky on Desktop */}
            <div className="sticky top-0 z-30 bg-[#0E1512]/90 backdrop-blur-xl border-b border-[#2D4A3A] py-6 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        {/* Search Bar Group */}
                        <div className="w-full lg:max-w-2xl flex items-center bg-[#1A2C22] rounded-full border border-[#2D4A3A] p-1 shadow-lg focus-within:border-primary/50 transition-all">
                            <div className="flex-1 flex items-center px-4">
                                <Search className="w-5 h-5 text-gray-500 mr-3 rtl:ml-3" />
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    className="bg-transparent w-full outline-none text-white placeholder-gray-500 h-10 text-sm md:text-base"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="hidden md:flex h-8 w-px bg-[#2D4A3A]"></div>
                            <button className="hidden md:flex items-center px-4 gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium">
                                <span className="truncate max-w-[120px]">{t('allCategories')}</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <Button className="rounded-full px-6 py-2.5 h-auto text-sm font-bold">
                                {t('search')}
                            </Button>
                        </div>

                        {/* Result Count (Google Style) */}
                        <div className="hidden lg:block text-gray-500 text-sm">
                            {t('resultsFound', { count: MOCK_TECHNICIANS.length })}
                        </div>

                        {/* Mobile Filter Toggle */}
                        <div className="flex lg:hidden w-full items-center justify-between">
                            <div className="text-gray-500 text-sm">
                                {MOCK_TECHNICIANS.length} {t('resultsFound', { count: '' }).replace(/.*\{count\}.*/, '')}
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="flex items-center gap-2 bg-[#1A2C22] border border-[#2D4A3A] px-4 py-2 rounded-xl text-sm font-bold text-primary"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                {t('filters')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="container mx-auto max-w-7xl px-6 mt-8">
                <div className={`flex flex-col lg:flex-row gap-8 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>

                    {/* LEFT SIDEBAR - Desktop Sticky Filters */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-32">
                            <FilterSidebar />
                        </div>
                    </aside>

                    {/* RIGHT CONTENT AREA - Results List */}
                    <main className="flex-1">
                        {/* Page Title & Breadcrumb Style */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold mb-2">
                                {t('title')}
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{t('categories')}</span>
                                <span>/</span>
                                <span className="text-primary font-medium">{t('professionalTechnicians')}</span>
                            </div>
                        </div>

                        {/* Results List */}
                        <div className="flex flex-col gap-6">
                            {MOCK_TECHNICIANS.map((tech) => (
                                <TechnicianResultCard key={tech.id} tech={tech} />
                            ))}
                        </div>

                        {/* Load More (Google Style) */}
                        <div className="mt-12 py-8 border-t border-[#2D4A3A] flex justify-center">
                            <div className="flex items-center gap-4">
                                <button className="text-primary font-bold hover:underline">{t('previous')}</button>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3].map(n => (
                                        <button key={n} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${n === 1 ? 'bg-primary text-background-dark' : 'hover:bg-[#1A2C22] text-gray-400'}`}>
                                            {n}
                                        </button>
                                    ))}
                                </div>
                                <button className="text-primary font-bold hover:underline">{t('next')}</button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* MOBILE FILTER DRAWER */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
                    <div className={`absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto bg-[#0E1512] border-t border-[#2D4A3A] rounded-t-[40px] p-6 transition-transform transform ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">{t('filters')}</h3>
                            <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full bg-[#1A2C22]">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <FilterSidebar className="!border-none !p-0 !bg-transparent" />
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <Button variant="outline" className="rounded-xl" onClick={() => setIsFilterOpen(false)}>
                                {isRtl ? "إلغاء : " : "Cancel"}
                            </Button>
                            <Button className="rounded-xl" onClick={() => setIsFilterOpen(false)}>
                                {isRtl ? "تطبيق" : "Apply"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
