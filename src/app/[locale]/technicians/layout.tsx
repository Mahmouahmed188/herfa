export const metadata = {
  title: 'Technicians | Herfa',
  description: 'Find skilled technicians for your needs',
};

export default function TechniciansLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
