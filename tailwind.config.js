/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-green-300',
    'bg-gray-200'
  ],
  theme: {
    extend: {
      colors: {
        rebeccapurple: '#663399'
      }
    },
  },
  plugins: [],
}

// Husk å starte npm run dev på nytt etter du gjør endringer i denne