/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#0b1437",
          200: "rgba(255, 255, 255, 0.1)",
        },
        "secondary-grey-600": "#a3aed0",
        darkslateblue: "#111c44",
        white: "#fff",
        "primary-purple-blue-400": "#7551ff",
        gainsboro: "#d9d9d9",
      },
      spacing: {},
      fontFamily: {
        "dm-sans": "'DM Sans'",
      },
      gridTemplateRows: {
        layout: "auto 1fr auto",
      },
      gridTemplateColumns: {
        layout: "280px 1fr",
      },
    },
    fontSize: {
      sm: "14px",
      lg: "16px",
      xl : "26px",
      inherit: "inherit",
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      mq750: {
        raw: "screen and (max-width: 750px)",
      },
      mq675: {
        raw: "screen and (max-width: 675px)",
      },
      mq450: {
        raw: "screen and (max-width: 450px)",
      },
      mq1224:{
        raw: "screen and (max-width: 1224px)",
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
