'use client';

import { Link } from '@/lib/navigation';

export function HeaderLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 shrink-0 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded-xl"
      aria-label="Herfa - Home"
    >
      <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
        <span className="text-white font-bold text-lg">H</span>
      </div>
      <span className="text-white text-lg font-bold hidden sm:block">Herfa</span>
    </Link>
  );
}
