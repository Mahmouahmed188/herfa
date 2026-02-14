import HeroSection from '@/components/landing/HeroSection';
import StatsSection from '@/components/landing/StatsSection';
import AiDiagnosisSection from '@/components/landing/AiDiagnosisSection';
import TechniciansSection from '@/components/landing/TechniciansSection';
import AppDownloadSection from '@/components/landing/AppDownloadSection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <AiDiagnosisSection />
      <TechniciansSection />
      <AppDownloadSection />
    </div>
  );
}
