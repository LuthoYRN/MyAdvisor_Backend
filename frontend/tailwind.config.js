/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#003C69',
        secondary: {
          100: '#E2E2D5',
          200: '#888883',
        },
      },
    },
  },
  plugins: [],
}

