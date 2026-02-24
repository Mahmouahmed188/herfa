import { AppSidebar } from '@/components/layout/AppSidebar';
import { Footer } from '@/components/layout/Footer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <AppSidebar role="admin" />
        <main className="flex-1 md:pl-64 p-8 bg-muted/10">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
