/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        personalizedGreen: "#5BD198",
        personalizedOrange: "#FDAF5D",
        personalizedPurple: "#967EFB",
        personalizedPink: "#D669CB",
        personalizedRed: "#FF6B6B",
      },
    },
  },
  plugins: [],
};