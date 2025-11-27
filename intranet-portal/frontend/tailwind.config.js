/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        background: '#F8FAFC',
        card: '#FFFFFF',
        sidebar: '#FFFFFF',
        'border-color': '#E2E8F0',
        primary: '#3B82F6',
        'primary-light': '#DBEAFE',
        'text-primary': '#1E293B',
        'text-secondary': '#64748B',

        // Dark mode colors
        'dark-background': '#0F172A',
        'dark-card': '#1E293B',
        'dark-sidebar': '#1E293B',
        'dark-border': '#334155',
        'dark-text-primary': '#F8FAFC',
        'dark-text-secondary': '#94A3B8',
      },
    },
  },
  plugins: [],
}
