/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f1724',
        soft: '#f6f7f8'
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(16,24,40,0.06)'
      }
    }
  },
  plugins: []
}