'use client';

import { Link } from '@/lib/navigation';

export function HeaderLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 shrink-0 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-xl"
      aria-label="Herfa - Home"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-surface-dark group-hover:bg-primary/20 transition-all duration-300 shadow-lg group-hover:shadow-primary/10">
        <span className="material-symbols-outlined text-3xl text-primary group-hover:scale-110 transition-transform">
          construction
        </span>
      </div>
      <span className="text-white text-lg font-bold hidden sm:block">Herfa</span>
    </Link>
  );
}
