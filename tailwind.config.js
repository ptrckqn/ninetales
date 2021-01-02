const plugin = require("tailwindcss/plugin");

module.exports = {
  purge: false,
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ["montserrat", "sans-serif"],
      serif: ["New York Large", "serif"],
    },
    extend: {
      colors: {
        "orange-main": "#F78F32",
        "orange-light": "#FCBD26",
        "orange-dark": "F04F2F",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        ".safe-top": {
          paddingTop: "max(constant(safe-area-inset-top), 0.25rem)",
          paddingTop: "max(env(safe-area-inset-top), 0.25rem)",
        },
        ".safe-left": {
          paddingLeft: "max(constant(safe-area-inset-left), 0.25rem)",
          paddingLeft: "max(env(safe-area-inset-left), 0.25rem)",
        },
        ".safe-right": {
          paddingRight: "max(constant(safe-area-inset-right), 0.25)",
          paddingRight: "max(env(safe-area-inset-right), 0.25)",
        },
        ".safe-bottom": {
          paddingBottom: "max(constant(safe-area-inset-bottom), 0.25)",
          paddingBottom: "max(env(safe-area-inset-bottom), 0.25)",
        },
      };

      addUtilities(newUtilities);
    }),
  ],
};
