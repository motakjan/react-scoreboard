import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern":
          "linear-gradient(to right bottom, rgba(0, 0, 0, 0.95),rgba(25, 25, 25, 0.9), rgba(200,1,11, 0.9)), url('/images/bg.jpg')",
      },
    },
    fontFamily: {
      sans: ["Mulish", "sans-serif"],
    },
  },
  plugins: [],
} satisfies Config;
