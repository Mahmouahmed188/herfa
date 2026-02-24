export const metadata = {
  title: 'AI Diagnosis | Herfa',
  description: 'AI-powered diagnosis for your technical problems',
};

export default function AIDiagnosisLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
