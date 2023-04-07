import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "skeleton-black": "#1E1E1E",
        layout: "#0e0e0e",
      },
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(to right bottom, rgba(0, 0, 0),rgba(25, 25, 200, 0.92), rgba(0,1,0, 0.95)), url('/images/Waimakariri.svg')",
        "404":
          "linear-gradient(rgba(0,0,0, 0.9),rgba(0,0,0, 0.9), rgba(200, 0, 0, 0.9)), url('/images/Whangaehu.png')",
      },
    },
    fontFamily: {
      sans: ["Mulish", "sans-serif"],
    },
  },
  plugins: [],
} satisfies Config;
