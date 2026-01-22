'use client';

import React, { useState } from 'react';
import { Search, MapPin, Filter, Bell, ChevronDown } from 'lucide-react';
import TechnicianCard, { TechnicianProps } from '@/components/find-work/TechnicianCard';
import Button from '@/components/ui/button';

// Mock Data
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
    },
    {
        id: '6',
        name: 'Robert Taylor',
        title: 'Smart Home Tech',
        rating: 4.6,
        reviews: 42,
        hourlyRate: 35,
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        matchPercentage: 82,
        skills: ['IoT', 'Security Systems', 'Network'],
        verified: true,
        available: true,
    },
];

export default function FindWorkPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <main className="min-h-screen bg-[#0E1512] text-white font-sans selection:bg-primary/30">
            {/* 1. Top Navigation Bar (Mocked as Page Header for Demo) */}
            {/* Note: In a real app, this might be the global layout navbar, but implemented here to match the specific 'User avatar' and 'Notification' request */}
            <header className="border-b border-[#1F3326] bg-[#0E1512]/80 backdrop-blur-md sticky top-0 z-40">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        {/* We use the Global Navbar usually, but here is the specific sub-nav if needed. 
                             For this demo, we assume this sits below the global nav or replaces it in a dashboard layout.
                             We'll render a simple view here tailored for the 'Find Work' context. */}
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                            <a href="#" className="text-white">Find Work</a>
                            <a href="#" className="hover:text-primary transition-colors">My Jobs</a>
                            <a href="#" className="hover:text-primary transition-colors">Messages</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#0E1512]"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-[#1F3326]">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white leading-none">Mahmoud A.</p>
                                <p className="text-xs text-primary mt-1">Project Manager</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-surface-border border border-primary/20 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80)' }}></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Hero / Search Section */}
            <section className="relative pt-16 pb-20 px-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>

                <div className="container mx-auto max-w-5xl text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                        Find the perfect pro for <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">your project</span>
                    </h1>
                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                        Our AI-powered matching system analyzes your project needs to connect you with top-rated technicians in your area instantly.
                    </p>

                    {/* Search Bar */}
                    <div className="bg-[#1A2C22] p-2 rounded-2xl border border-[#2D4A3A] shadow-2xl flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
                        <div className="flex-1 flex items-center px-4 h-14 bg-[#111A13] rounded-xl border border-[#1F3326] focus-within:border-primary/50 transition-colors">
                            <Search className="w-5 h-5 text-gray-500 mr-3" />
                            <input
                                type="text"
                                placeholder="What service do you need?"
                                className="bg-transparent w-full outline-none text-white placeholder-gray-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4 h-14 bg-[#111A13] rounded-xl border border-[#1F3326] relative cursor-pointer hover:border-gray-600 transition-colors">
                            <Filter className="w-5 h-5 text-gray-500 mr-3" />
                            <span className="text-gray-400">All Categories</span>
                            <ChevronDown className="w-4 h-4 text-gray-600 ml-auto" />
                        </div>
                        <div className="flex-1 flex items-center px-4 h-14 bg-[#111A13] rounded-xl border border-[#1F3326] relative cursor-pointer hover:border-gray-600 transition-colors">
                            <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                            <span className="text-gray-400">Cairo, Egypt</span>
                            <ChevronDown className="w-4 h-4 text-gray-600 ml-auto" />
                        </div>
                        <Button className="h-14 px-8 rounded-xl text-lg font-bold">
                            Search
                        </Button>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        <button className="px-4 py-2 rounded-full bg-[#1A2C22] border border-[#2D4A3A] text-sm font-medium text-primary hover:bg-[#22382B] transition-colors">
                            Verified Pro
                        </button>
                        <button className="px-4 py-2 rounded-full bg-[#1A2C22] border border-[#2D4A3A] text-sm font-medium text-gray-400 hover:text-white hover:bg-[#22382B] transition-colors">
                            Available Now
                        </button>
                        <button className="px-4 py-2 rounded-full bg-[#1A2C22] border border-[#2D4A3A] text-sm font-medium text-gray-400 hover:text-white hover:bg-[#22382B] transition-colors">
                            Top Rated
                        </button>
                        <button className="px-4 py-2 rounded-full bg-[#1A2C22] border border-[#2D4A3A] text-sm font-medium text-gray-400 hover:text-white hover:bg-[#22382B] transition-colors">
                            &lt; $50/hr
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. Recommended Technicians Section */}
            <section className="px-6 pb-24">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Recommended for you</h2>
                            <p className="text-gray-400 text-sm">Based on your recent search for "Electrical repairs"</p>
                        </div>
                        <span className="text-gray-500 text-sm font-medium">Showing {MOCK_TECHNICIANS.length} results</span>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_TECHNICIANS.map((tech) => (
                            <TechnicianCard key={tech.id} tech={tech} />
                        ))}
                    </div>

                    {/* 5. Load More */}
                    <div className="mt-16 text-center">
                        <Button variant="outline" className="h-12 border-[#2D4A3A] text-gray-300 hover:text-white hover:border-primary hover:bg-[#1A2C22] rounded-full px-8">
                            Show more technicians
                            <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    );
}
