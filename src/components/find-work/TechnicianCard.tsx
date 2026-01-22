import React from 'react';
import { Star, MapPin, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/button';

export interface TechnicianProps {
    id: string;
    name: string;
    title: string;
    rating: number;
    reviews: number;
    hourlyRate: number;
    image: string;
    matchPercentage: number;
    skills: string[];
    verified?: boolean;
    available?: boolean;
}

export default function TechnicianCard({ tech }: { tech: TechnicianProps }) {
    return (
        <div className="group relative bg-[#1A2C22] hover:bg-[#22382B] border border-[#2D4A3A] hover:border-primary/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1">
            {/* AI Match Badge */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-[#131F18]/90 backdrop-blur-md border border-primary/30 px-3 py-1.5 rounded-full shadow-lg">
                <Zap className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-bold text-primary">{tech.matchPercentage}% Match</span>
            </div>

            {/* Profile Header (Image + Status) */}
            <div className="relative h-28 bg-gradient-to-r from-[#111A13] to-[#1A2C22]">
                <div className="absolute -bottom-10 left-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl border-4 border-[#1A2C22] bg-gray-800 bg-cover bg-center shadow-lg" style={{ backgroundImage: `url(${tech.image})` }}></div>
                        {tech.verified && (
                            <div className="absolute -bottom-2 -right-2 bg-primary text-background-dark p-1 rounded-full border border-[#1A2C22]" title="Verified Pro">
                                <ShieldCheck className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pt-12 px-6 pb-6 flex flex-col gap-4">

                {/* Info */}
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{tech.name}</h3>
                            <p className="text-gray-400 text-sm font-medium">{tech.title}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white font-bold text-lg">${tech.hourlyRate}<span className="text-xs text-gray-500 font-normal">/hr</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-bold text-sm">{tech.rating}</span>
                            <span className="text-gray-500 text-xs">({tech.reviews})</span>
                        </div>
                        {tech.available && (
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs text-green-400 font-medium">Available Now</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                    {tech.skills.map((skill, index) => (
                        <span key={index} className="px-2.5 py-1 rounded-lg bg-[#2D4A3A]/50 text-gray-300 text-xs font-medium border border-[#2D4A3A]">
                            {skill}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <Button className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white border-none rounded-xl">
                    View Profile <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
