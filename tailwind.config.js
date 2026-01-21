/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4D5C',
          light: '#2E6A80',
          dark: '#0F3540',
        },
        accent: {
          DEFAULT: '#E67635',
          light: '#F29559',
        },
      },
    },
  },
  plugins: [],
}
