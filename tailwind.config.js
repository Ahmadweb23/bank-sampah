/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#003a36',
        'primary-container': '#00534d',
        secondary: '#0a45e6',
        background: '#f9f9ff',
        surface: '#f9f9ff',
        'surface-container': '#e7eeff',
        'surface-container-low': '#f0f3ff',
        'surface-container-lowest': '#ffffff',
        'on-surface': '#121c2c',
        'on-surface-variant': '#3f4947',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        outline: '#6f7977',
        success: '#1f8f5f',
        error: '#ba1a1a'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
