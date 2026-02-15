/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs extraites du design de l'image
        'brand-blue': {
          DEFAULT: '#0066FF', // Bleu profond du header et boutons
          50: '#E6F1FF',
          100: '#CCE3FF',
          200: '#99C7FF',
          300: '#66ABFF',
          400: '#338FFF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
        },
        'brand-green': {
          DEFAULT: '#00D9A3', // Vert émeraude pour les boutons d'inscription
          50: '#E6FBF5',
          100: '#CCF7EB',
          200: '#99EFD7',
          300: '#66E7C3',
          400: '#33DFAF',
          500: '#00D9A3',
          600: '#00AE82',
          700: '#008262',
          800: '#005741',
          900: '#002B21',
        },
        'neutral-bg': '#F5F7FA', // Fond gris léger
        'pulse-bar': '#000000', // Barre noire du haut
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
