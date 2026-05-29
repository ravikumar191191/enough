/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Fraunces for display numerals, Newsreader for body — per spec §7.
        display: ['"Fraunces"', "Georgia", "serif"],
        body: ['"Newsreader"', "Georgia", "serif"],
      },
      colors: {
        // Warm "paper" light theme + high-contrast dark theme.
        paper: {
          bg: "#f7f3ec",
          panel: "#fffdf8",
          border: "#e3dccb",
          ink: "#23201a",
          muted: "#6f685b",
          accent: "#9a3412", // burnt sienna — editorial accent
        },
        night: {
          bg: "#16140f",
          panel: "#211e17",
          border: "#3a352a",
          ink: "#f4efe4",
          muted: "#a59c88",
          accent: "#f59e6b",
        },
      },
    },
  },
  plugins: [],
};
