
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'yt-red': '#FF0000',
        'yt-black': '#0F0F0F',
        'yt-light-black': '#272727',
        'yt-white': '#F1F1F1',
        'yt-light-gray': '#AAAAAA',
      },
    },
  },
  plugins: [],
}
