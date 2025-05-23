/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'], // Mantém a fonte Montserrat
      },
      colors: {
        // Paleta de cores fixas (as mesmas do globals.css)
        primary: '#0f96e4',      // Azul Nutrana
        secondary: '#21d448',    // Verde Nutrana
        accent: '#80d421',       // Verde claro
        light: '#ffeaea',        // Rosa claro
        dark: '#1a1a1a',         // Preto suave
        
        // Opcional: você pode mapear as variáveis CSS também
        // (útil se quiser alternar entre temas)
        /*
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        */
      },
    },
  },
  plugins: [],
}