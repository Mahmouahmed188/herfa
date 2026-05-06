'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Briefcase, Zap, Wrench, Paintbrush, Hammer, Thermometer } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/lib/navigation';
import * as api from '@/services/api';
import Button from '@/components/ui/button';

interface Service {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    priceUnit: string;
    image: string;
    icon: string;
    categoryId: string;
}

const CATEGORY_ICONS: Record<string, any> = {
    'Plumbing': Wrench,
    'Carpentry': Hammer,
    'Electrical': Zap,
    'Painting': Paintbrush,
    'HVAC': Thermometer,
};

export default function ServicesListingPage() {
    const locale = useLocale();
    const t = useTranslations('Services');
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchServices() {
            try {
                const data = await api.getServices();
                setServices(data);
            } catch (error) {
                console.error('Failed to fetch services', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchServices();
    }, []);

    const filteredServices = Array.isArray(services) ? services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="bg-[#0A0F0D] min-h-screen text-white pt-32 pb-24 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Explore Our <span className="text-primary">Professional Services</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Find the right expert for your home maintenance needs. Browse categories or search for specific services.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-2xl mx-auto mb-16">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for services (e.g., plumbing, electrical...)"
                        className="w-full bg-[#1A2C22] border border-white/10 rounded-full py-5 pl-14 pr-6 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-[#1A2C22] border border-white/5 rounded-[32px] h-64 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.length > 0 ? (
                            filteredServices.map((service) => (
                                <Link 
                                    key={service.id} 
                                    href={`/services/${service.id}` as any}
                                    className="group bg-[#1A2C22] border border-white/5 rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all active:scale-[0.98]"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img 
                                            src={service.image || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80'} 
                                            alt={service.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2C22] to-transparent opacity-60" />
                                        <div className="absolute bottom-4 left-6">
                                            <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary uppercase tracking-widest">
                                                {service.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.name}</h3>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                                            {service.description || 'High-quality professional service for your home.'}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Starting At</span>
                                                <span className="text-xl font-black">${service.basePrice || 40}<span className="text-xs text-gray-400 font-medium ml-1">/{service.priceUnit || 'hr'}</span></span>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-background-dark transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-10 h-10 text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">No services found</h3>
                                <p className="text-gray-500">Try searching with different keywords.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
