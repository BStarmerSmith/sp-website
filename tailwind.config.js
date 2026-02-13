/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./src/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          pink: '#EA98DA',
          peach: '#F3A9CA',
          coral: '#FFBEB6',
        },
      },
    },
  },
  plugins: [],
}
