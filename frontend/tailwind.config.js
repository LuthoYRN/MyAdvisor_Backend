/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#003C69',
        secondary: '#0098DB',
        background: {
          100: '#E2E2D5',
          200: '#F0F0F0',
        },
      },
    },
  },
  plugins: [],
}

