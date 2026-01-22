import { AppSidebar } from '@/components/layout/AppSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    // In a real app, we would have a separate Admin Sidebar or reuse AppSidebar with 'admin' role
    // For MVP, letting AppSidebar handle 'admin' role if I passed it, or creating a simple wrapper.
    // I didn't add 'admin' items to AppSidebar in the previous step, I should do that or just pass empty for now since only dashboard is required.
    // Actually, I should update AppSidebar to support admin items.

    return (
        <div className="flex min-h-screen">
            {/* Reusing Sidebar, note: need to update AppSidebar to have Admin items or it will be empty */}
            <AppSidebar role="admin" />
            <main className="flex-1 md:pl-64 p-8 bg-muted/10">
                {children}
            </main>
        </div>
    );
}
