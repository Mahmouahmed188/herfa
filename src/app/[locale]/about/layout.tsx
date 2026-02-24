export const metadata = {
  title: 'About | Herfa',
  description: 'Learn more about Herfa',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
