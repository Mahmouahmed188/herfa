import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#53d22d",
                "background-light": "#f6f8f6",
                "background-dark": "#131712",
                "surface-dark": "#1f251d",
                "surface-border": "#2d372a",
                // Keeping essential Shadcn system colors for compatibility
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "2rem",
                "xl": "3rem",
                "full": "9999px",
                // Shadcn border radius overlap - ensuring we don't break existing UI completely,
                // but prioritizing the user's 'lg' and 'xl' for the landing page.
                "md": "calc(var(--radius) - 2px)",
                "sm": "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [
        require("@tailwindcss/container-queries"),
    ],
};
export default config;
