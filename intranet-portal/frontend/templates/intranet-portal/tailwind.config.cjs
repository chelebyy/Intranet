/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#3B82F6",
                "primary-dark": "#2563EB",
                "primary-light": "#EFF6FF",
                "background": "#F8FAFC",
                "sidebar": "#FFFFFF",
                "card": "#FFFFFF",
                "border-color": "#E2E8F0",
                "text-primary": "#1E293B",
                "text-secondary": "#64748B",
                "text-muted": "#94A3B8",

                // Dark mode colors
                "dark-background": "#0F172A",
                "dark-sidebar": "#1E293B",
                "dark-card": "#1E293B",
                "dark-border": "#334155",
                "dark-text-primary": "#F8FAFC",
                "dark-text-secondary": "#94A3B8",
                "dark-text-muted": "#64748B"
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"],
                "body": ["Inter", "sans-serif"]
            },
        },
    },
    plugins: [],
}
