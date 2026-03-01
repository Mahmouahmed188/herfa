// Auth pages have their own layout (split panel with branding), so we don't want the global Navbar/Footer.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
