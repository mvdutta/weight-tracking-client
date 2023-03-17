/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6a8fa7",
        dark: "#43667c",
        burnt: "#925631",
      },
      fontFamily: {
        body: ["Nunito"],
      },
    },
  },
  plugins: [],
};
