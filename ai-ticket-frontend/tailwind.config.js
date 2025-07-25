// tailwind.config.js
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.141 0.005 285.823)",
        border: "oklch(0.92 0.004 286.32)",
        ring: "oklch(0.705 0.015 286.067)",
        // ...add other custom color variables if needed
      },
    },
  },
  plugins: [daisyui, require("tw-animate-css")],
};
