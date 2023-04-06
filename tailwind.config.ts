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
          "linear-gradient(to right bottom, rgba(0, 0, 0, 0.95),rgba(25, 25, 25, 0.9), rgba(200,1,11, 0.9)), url('/images/bg.jpg')",
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
