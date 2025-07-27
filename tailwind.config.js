/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3662e3',
        'primary-hover': '#2952cc',
        light: {
          bg: '#fafafa',
          text: '#09090b',
          card: '#ffffff',
          border: '#e5e7eb'
        },
        dark: {
          bg: '#09090b',
          text: '#fafafa',
          card: '#1f2937',
          border: '#374151'
        }
      },
      backgroundColor: {
        'light-primary': '#fafafa',
        'dark-primary': '#09090b'
      },
      textColor: {
        'light-primary': '#09090b',
        'dark-primary': '#fafafa'
      }
    },
  },
  plugins: [],
}