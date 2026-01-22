'use client';

import { Hammer, Facebook, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-backgroundDark border-t border-surfaceBorder pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-surfaceDark">
                            <Hammer className="w-6 h-6 text-primary" />
                        </div>
                        <span className="font-bold text-xl text-white">Herfa</span>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-gray-400">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Contact Support</Link>
                    </div>

                    <div className="flex gap-4">
                        <a href="#" className="h-10 w-10 rounded-full bg-surfaceDark flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-all">
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="h-10 w-10 rounded-full bg-surfaceDark flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-all">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="h-10 w-10 rounded-full bg-surfaceDark flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-all">
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-surfaceBorder">
                    <p className="text-gray-600 text-sm">© 2023 Herfa Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
