/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/**/*.html', 
    './public/js/**/*.js', 
  ],
  theme: {
    extend: {
      colors: {
        background: '#1E40AF', 
        secondary: '#F43F5E', 
        accent: '#DF29F3', 
      },
      fontFamily: {
        mont: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
