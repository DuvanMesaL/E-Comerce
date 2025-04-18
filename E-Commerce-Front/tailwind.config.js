/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta principal - Morados
        primary: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        // Acentos - Cian/Turquesa
        accent: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
        },
        // Fondo oscuro
        dark: {
          100: "#4b5563", // Gris oscuro
          200: "#374151",
          300: "#1f2937",
          400: "#111827",
          500: "#0f172a", // Muy oscuro
          600: "#0c1222",
          700: "#090f1c",
          800: "#060b16",
          900: "#030712",
        },
        // Transparencias
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          medium: "rgba(255, 255, 255, 0.05)",
          dark: "rgba(0, 0, 0, 0.3)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        neon: '0 0 5px theme("colors.primary.500"), 0 0 20px theme("colors.primary.500")',
        "neon-sm":
          '0 0 2px theme("colors.primary.500"), 0 0 10px theme("colors.primary.500")',
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
