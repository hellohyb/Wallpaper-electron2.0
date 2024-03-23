/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
    './index.html',
    './src/renderer/src/**/*.{ts,js,vue,html}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins:{
    preflight:false
  }
}

