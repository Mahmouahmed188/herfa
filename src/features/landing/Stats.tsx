'use client';

export function Stats() {
    return (
        <section className="w-full border-y border-gray-200 dark:border-surface-border bg-white dark:bg-[#1a2119]">
            <div className="px-4 md:px-10 lg:px-40 flex justify-center py-10">
                <div className="max-w-[1200px] w-full grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center justify-center text-center gap-1">
                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">15k+</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Active Technicians</p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center gap-1">
                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">98%</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Client Satisfaction</p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center gap-1">
                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">2.5m</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Projects Completed</p>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center gap-1">
                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">24/7</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Support Available</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
