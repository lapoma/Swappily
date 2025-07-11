// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aggiungi QUI i tuoi colori personalizzati
        background_2: "#fbf8f7",  // Esempio: grigio chiaro
        button_2: "#5ae110",
        button_1: '#2563eb',       // Esempio: blu Tailwind
        text_1: "#000000",         // Esempio: grigio scuro
      },
    },
  },
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {},
  },
  plugins: [],
}