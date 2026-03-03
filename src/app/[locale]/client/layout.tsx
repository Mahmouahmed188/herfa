import { AppSidebar } from '@/components/layout/AppSidebar';
import { Footer } from '@/components/layout/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1">
      <AppSidebar role="client" />
      <div className="flex-1 md:pl-64 p-8 bg-muted/10">
        {children}
      </div>
    </div>
  );
}
