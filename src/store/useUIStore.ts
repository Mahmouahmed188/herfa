import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
    theme: 'light' | 'dark' | 'system';
    language: 'en' | 'ar';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setLanguage: (lang: 'en' | 'ar') => void;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            theme: 'dark', // Default to dark as per requirements
            language: 'en',
            setTheme: (theme) => set({ theme }),
            setLanguage: (language) => set({ language }),
            sidebarOpen: false,
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        }),
        {
            name: 'herfa-ui',
        }
    )
);
