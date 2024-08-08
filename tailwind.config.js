/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#121212",
        "dark-surface": "#1E1E1E",
        "dark-primary": "#90CAF9",
        "dark-secondary": "#B0BEC5",
        "dark-accent": "#64B5F6",
        "dark-on-bg": "#FFFFFF",
        "dark-on-surface": "#FFFFFF",
      },
    },
  },
  plugins: [],
};
