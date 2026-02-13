/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#19e65e",
        "background-light": "#f6f8f6",
        "background-dark": "#112116",
        "status-scheduled": "#e0f2fe",
        "status-scheduled-text": "#0369a1",
        "status-inprogress": "#ffedd5",
        "status-inprogress-text": "#c2410c",
        "status-completed": "#f3e8ff",
        "status-completed-text": "#7e22ce",
        "status-urgent": "#fee2e2",
        "status-urgent-text": "#dc2626",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "1rem",
        "lg": "2rem",
        "xl": "3rem",
        "full": "9999px"
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
