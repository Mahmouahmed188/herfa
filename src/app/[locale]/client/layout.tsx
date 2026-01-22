import { AppSidebar } from '@/components/layout/AppSidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <AppSidebar role="client" />
            <main className="flex-1 md:pl-64 p-8 bg-muted/10">
                {children}
            </main>
        </div>
    );
}
