/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        s2: {
          red: {
            500: "#E53E3E"
          },

          indigo: {
            50: "#F7F6FE",
            100: "#ECE8FD",
            200: "#DCD5FB",
            300: "#CCC3F9",
            400: "#B0A0F8",
            500: "#7760E1",
            600: "#553ACF",
            700: "#472EB7",
            800: "#3A249E",
            900: "#2F206E"
          },

          purple: {
            50: "#FCF5FF",
            100: "#FAF0FF",
            200: "#F9EDFF",
            300: "#F1D6FF",
            400: "#ECC7FF",
            500: "#DB94FF",
            600: "#C550FF",
            700: "#BB29FF",
            800: "#AA00FF",
            900: "#8800CC"
          },

          gray: {
            50: "#FCFCFC",
            100: "#FAFAFA",
            200: "#F3F3F5",
            300: "#E6E5EA",
            400: "#D7D7DA",
            500: "#C2C1C7",
            600: "#908E94",
            700: "#777582",
            800: "#4C4A57",
            900: "#1B1A21"
          },

          misc: {
            1: "#F5F5F5"
          }
        }
      }
    }
  },
  plugins: []
};
