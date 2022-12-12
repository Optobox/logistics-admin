/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**{js,ts,jsx,tsx}",
    "./src/components/**{js,ts,jsx,tsx}",
    "./src/modules/**{js,ts,jsx,tsx}",
    "./src/layout/**{js,ts,jsx,tsx}",
    "./src/includes/**{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem'
      }
      , fontFamily: {
        "manrope":["Manrope"],
        "jost":["Jost"]
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
