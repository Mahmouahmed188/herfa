'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, Star, Clock, ShieldCheck, CheckCircle, ArrowRight, Zap, Info } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, useRouter } from '@/lib/navigation';
import * as api from '@/services/api';
import Button from '@/components/ui/button';

interface Service {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    priceUnit: string;
    image: string;
    categoryId: string;
    category?: {
        name: string;
    };
}

export default function ServiceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const locale = useLocale();
    const router = useRouter();
    const [service, setService] = useState<Service | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchService() {
            if (!id) return;
            try {
                const data = await api.getServiceById(id);
                setService(data);
            } catch (error) {
                console.error('Failed to fetch service detail', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchService();
    }, [id]);

    if (isLoading) {
        return (
            <div className="bg-[#0A0F0D] min-h-screen text-white pt-32 pb-24 px-6 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!service) {
        return (
            <div className="bg-[#0A0F0D] min-h-screen text-white pt-32 pb-24 px-6 text-center">
                <h1 className="text-3xl font-bold mb-4">Service not found</h1>
                <Link href="/services" className="text-primary hover:underline">Back to services</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#0A0F0D] min-h-screen text-white pb-24">
            {/* Hero Header */}
            <div className="relative h-[50vh] min-h-[400px]">
                <img 
                    src={service.image || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80'} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F0D] via-[#0A0F0D]/60 to-transparent" />
                
                <div className="absolute inset-0 pt-32 px-6">
                    <div className="container mx-auto max-w-5xl">
                        <Link 
                            href="/services" 
                            className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Back to Services
                        </Link>
                        
                        <div className="max-w-2xl">
                            <span className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary uppercase tracking-widest mb-6 inline-block">
                                {service.category?.name || 'General'}
                            </span>
                            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">{service.name}</h1>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                {service.description || 'Professional home service provided by certified experts.'}
                            </p>
                            
                            <div className="flex flex-wrap gap-8 items-center">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Starting At</span>
                                    <span className="text-3xl font-black text-white">${service.basePrice || 40}<span className="text-sm text-gray-400 font-medium ml-1">/{service.priceUnit || 'hr'}</span></span>
                                </div>
                                <div className="h-10 w-px bg-white/10 hidden md:block" />
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0A0F0D] bg-white/10 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Expert" />
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-gray-400">150+ Experts available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto max-w-5xl px-6 -mt-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* What's included */}
                        <div className="bg-[#1A2C22] border border-white/5 rounded-[40px] p-10">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                What's Included
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    'Professional equipment',
                                    'Certified technicians',
                                    'Satisfaction guarantee',
                                    'Insured work',
                                    'Materials & parts sourcing',
                                    'Site cleanup included'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 text-gray-300">
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <span className="text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Process */}
                        <div>
                            <h2 className="text-2xl font-bold mb-8">How it Works</h2>
                            <div className="space-y-6">
                                {[
                                    { title: 'Create a Tender', desc: 'Describe your specific needs and set your budget.' },
                                    { title: 'Receive Offers', desc: 'Qualified providers will bid on your request with prices and timelines.' },
                                    { title: 'Select the Best', desc: 'Compare profiles, reviews, and offers to choose your professional.' }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-[#1A2C22] border border-white/10 flex items-center justify-center font-black text-lg group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                                                {i + 1}
                                            </div>
                                            {i < 2 && <div className="w-0.5 h-full bg-white/5 my-2" />}
                                        </div>
                                        <div className="pt-2">
                                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{step.title}</h3>
                                            <p className="text-gray-400 text-sm">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Action */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1A2C22] border border-white/10 rounded-[40px] p-8 sticky top-32 shadow-2xl">
                            <h3 className="text-xl font-bold mb-6 text-center">Ready to get started?</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Zap className="w-4 h-4 text-primary" />
                                    Avg. response time: 15 mins
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Info className="w-4 h-4 text-primary" />
                                    Bidding is 100% free
                                </div>
                            </div>

                            <Link 
                                href={`/tenders/create?serviceId=${service.id}` as any}
                                className="block"
                            >
                                <Button className="w-full rounded-2xl py-5 h-auto text-base font-extrabold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                    Create Tender
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>

                            <p className="text-[10px] text-center text-gray-600 mt-6 uppercase tracking-widest font-bold">
                                Secure Booking • Quality Guaranteed
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
