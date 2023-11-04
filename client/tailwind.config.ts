import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          "50": "hsl(var(--color-primary-50))",
          "100": "hsl(var(--color-primary-100))",
          "200": "hsl(var(--color-primary-200))",
          "300": "hsl(var(--color-primary-300))",
          "400": "hsl(var(--color-primary-400))",
          "500": "hsl(var(--color-primary-500))",
          "600": "hsl(var(--color-primary-600))",
          "700": "hsl(var(--color-primary-700))",
          "800": "hsl(var(--color-primary-100))",
          "900": "hsl(var(--color-primary-900))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          "50": "hsl(var(--color-secondary-50))",
          "100": "hsl(var(--color-secondary-100))",
          "200": "hsl(var(--color-secondary-200))",
          "300": "hsl(var(--color-secondary-300))",
          "400": "hsl(var(--color-secondary-400))",
          "500": "hsl(var(--color-secondary-500))",
          "600": "hsl(var(--color-secondary-600))",
          "700": "hsl(var(--color-secondary-700))",
          "800": "hsl(var(--color-secondary-100))",
          "900": "hsl(var(--color-secondary-900))",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
