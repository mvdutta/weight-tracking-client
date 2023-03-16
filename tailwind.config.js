/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(254, 64, 102)",
        secondary: {
          100: "#E2E2D5",
          200: "rgb(9, 104, 118)",
        },
        smoke: 'rgba(0, 0, 0, 0.4)'
      },
      fontFamily: {
        body: ["Nunito"],
      },
    },
  },
  plugins: [],
};
