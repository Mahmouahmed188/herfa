import { Star, MapPin, ShieldCheck, BadgeCheck, Award, ArrowLeft, Clock, ThumbsUp } from 'lucide-react';
import { Link } from "@/lib/navigation";

// Mock technician data - in production would be fetched from API
const technician = {
    id: '1',
    name: 'John Carpenter',
    title: 'Master Carpenter & Joiner',
    rating: 4.9,
    reviewCount: 120,
    location: 'Cairo, Egypt',
    experience: '15+ years',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZjQonIH3a-D03DzTjyLxRVdj8h_mOC9uQuZ_2eyw9lYHZH3ybvCl_w06OmfPT-vhAJd_BZAqrukCuqjRPjvB4CwSovBgVXdqGcErZu7uxBdYr1EMtVDAceg1LmDLC5BdRo6mird4hE7agG2pne_LwHcyuZ1zgTWbUFb9Wr5mtEOLCBqQr9xrQSVQSeKNVBdxObo8iSMXWbT2CpfJC_3J8VcPU_B7GPFEK__fDr-_2t0DFQSnrE99d7CLM3gaitRN1R72bi2mNZq8',
    about: "Hi, I'm John. I have over 15 years of experience in residential construction and fine woodworking. I specialize in custom cabinetry, hardwood flooring installation, and full-scale deck building. My goal is to bring your vision to life with precision and durability.\n\nI take pride in my punctuality and clean workspace. Whether it's a small repair or a major renovation, I treat every home as if it were my own. I am fully licensed and insured.",
    verifications: [
        { icon: ShieldCheck, label: 'Identity Verified', color: 'text-blue-500 bg-blue-500/10' },
        { icon: BadgeCheck, label: 'Insurance Valid', color: 'text-green-500 bg-green-500/10' },
        { icon: Award, label: 'Licensed Contractor', color: 'text-purple-500 bg-purple-500/10' },
    ],
    services: ['Custom Cabinetry', 'Hardwood Flooring', 'Deck Building', 'Door Installation', 'Trim & Molding'],
    ratingBreakdown: { 5: 90, 4: 8, 3: 2, 2: 0, 1: 0 },
    portfolio: [
        { title: 'Modern Kitchen Remodel', category: 'Cabinetry & Installation', color: 'bg-amber-900' },
        { title: 'Redwood Deck', category: 'Exterior Construction', color: 'bg-red-900' },
        { title: 'Oak Flooring', category: 'Refinishing & Install', color: 'bg-yellow-900' },
        { title: 'Custom Built-ins', category: 'Joinery', color: 'bg-stone-800' },
    ],
    reviews: [
        { name: 'Sarah Jenkins', time: '2 days ago', rating: 5, comment: 'John did an amazing job with our kitchen cabinets. He was punctual, polite, and finished the job ahead of schedule. The craftsmanship is top-notch. Highly recommend!' },
        { name: 'Michael Chen', time: '2 weeks ago', rating: 5, comment: 'Hired John for a custom deck project. He provided great suggestions that saved us money. Very transparent with pricing.' },
        { name: 'David R.', time: '1 month ago', rating: 4, comment: 'Great work on the flooring. Only reason for 4 stars was a slight delay in getting materials, but John communicated well throughout.' },
    ],
};

export default function TechnicianProfilePage() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Back nav */}
            <div className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-surface-border">
                <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center gap-3">
                    <Link href="/technicians" className="flex items-center gap-1.5 text-slate-500 dark:text-gray-400 hover:text-primary transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Technicians
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-8">
                {/* Profile header */}
                <div className="rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark overflow-hidden">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-primary/30 via-emerald-600/20 to-primary/10 relative">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #53d22d 0%, transparent 60%)' }} />
                    </div>

                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
                            <div
                                className="w-24 h-24 rounded-2xl bg-cover bg-center border-4 border-white dark:border-surface-dark shadow-xl shrink-0"
                                style={{ backgroundImage: `url("${technician.image}")` }}
                            />
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{technician.name}</h1>
                                        <p className="text-primary font-semibold">{technician.title}</p>
                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{technician.location}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{technician.experience} experience</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-center p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-xl font-bold text-slate-900 dark:text-white">{technician.rating}</span>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-0.5">{technician.reviewCount} reviews</p>
                                        </div>
                                        <button className="px-6 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verifications */}
                        <div className="flex flex-wrap gap-3 mt-5">
                            {technician.verifications.map((v) => (
                                <div key={v.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${v.color}`}>
                                    <v.icon className="w-3.5 h-3.5" />
                                    {v.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <div className="rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">About Me</h2>
                            <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed whitespace-pre-line">{technician.about}</p>
                        </div>

                        {/* Portfolio */}
                        <div className="rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Portfolio</h2>
                                <button className="text-primary text-sm font-semibold hover:underline">View All Projects</button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {technician.portfolio.map((item) => (
                                    <div key={item.title} className={`${item.color} rounded-xl p-4 aspect-square flex flex-col justify-end cursor-pointer group hover:opacity-90 transition-opacity relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="relative z-10">
                                            <p className="text-white font-bold text-sm leading-tight">{item.title}</p>
                                            <p className="text-white/60 text-xs mt-0.5">{item.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Customer Reviews</h2>
                            <div className="flex items-center gap-6 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-background-dark">
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-slate-900 dark:text-white">{technician.rating}</p>
                                    <div className="flex gap-0.5 mt-1 justify-center">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 text-yellow-400 fill-current" />)}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Based on {technician.reviewCount} reviews</p>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div key={star} className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 w-3 shrink-0">{star}</span>
                                            <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-surface-border overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-400 rounded-full"
                                                    style={{ width: `${technician.ratingBreakdown[star as keyof typeof technician.ratingBreakdown] || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-400 w-8 text-right shrink-0">
                                                {technician.ratingBreakdown[star as keyof typeof technician.ratingBreakdown] || 0}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-5">
                                {technician.reviews.map((review) => (
                                    <div key={review.name} className="border-b border-slate-100 dark:border-surface-border last:border-0 pb-5 last:pb-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <p className="font-semibold text-sm text-slate-900 dark:text-white">{review.name}</p>
                                                <p className="text-xs text-slate-400">{review.time}</p>
                                            </div>
                                            <div className="flex items-center gap-0.5 shrink-0">
                                                {Array.from({ length: review.rating }).map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                                        <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary mt-2 transition-colors">
                                            <ThumbsUp className="w-3 h-3" /> Helpful
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        {/* Services */}
                        <div className="rounded-2xl border border-slate-200 dark:border-surface-border bg-white dark:bg-surface-dark p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Services Offered</h2>
                            <div className="flex flex-wrap gap-2">
                                {technician.services.map((s) => (
                                    <span key={s} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Book CTA */}
                        <div className="rounded-2xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-6 text-center">
                            <p className="text-slate-900 dark:text-white font-bold mb-1">Ready to start?</p>
                            <p className="text-slate-500 dark:text-gray-400 text-sm mb-4">Book John for your next project</p>
                            <button className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20">
                                Book Now
                            </button>
                            <p className="text-xs text-slate-400 mt-3">No payment until work is complete</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
