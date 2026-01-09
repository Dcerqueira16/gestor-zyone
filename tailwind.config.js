/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zyone: {
          gold: '#C59D5F',
          hover: '#B0884A',
          black: '#111111',
          gray: '#F5F5F7'
        }
      }
    },
  },
  plugins: [],
}
