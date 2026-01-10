import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './src/app/globals.css', // 追加
  ],
  prefix: "",
  theme: {},
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
