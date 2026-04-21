/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "freedom-blue": "#1E3A8A", // Primary blue for trust
        "liberty-green": "#10B981", // Green for growth
        "golden-horizon": "#F59E0B", // Gold for wealth
        "midnight-slate": "#0F172A", // Dark BG
        "light-mist": "#F1F5F9", // Text
        "steel-gray": "#475569", // Neutrals
      },
    },
  },
  plugins: [],
};
