/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        color: {
          1: "#181818",
          2: "#242424",
          3: "#333333",
          4: "#3a3a3a",
        }
      }
    },
  },
  plugins: [],
}

