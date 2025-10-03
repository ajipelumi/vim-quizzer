/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        garet: ["Garet-Book", "sans-serif"],
      },
      colors: {
        // Vim-inspired color palette
        vim: {
          bg: "#1e1e1e",
          "bg-alt": "#2d2d2d",
          "bg-lighter": "#3c3c3c",
          fg: "#d4d4d4",
          "fg-dim": "#9ca3af",
          keyword: "#569cd6",
          string: "#ce9178",
          comment: "#6a9955",
          number: "#b5cea8",
          type: "#4ec9b0",
          constant: "#dcdcaa",
          error: "#f44747",
          warning: "#ffcc02",
          success: "#4ec9b0",
          info: "#569cd6",
          accent: "#007acc",
          "accent-hover": "#005a9e",
          border: "#3e3e3e",
          "border-light": "#555",
          focus: "#007acc",
          selection: "#264f78",
          hover: "#2a2d2e",
        },
        // Legacy primary colors for compatibility
        primary: {
          50: "#f0f9ff",
          500: "#007acc",
          600: "#005a9e",
          700: "#004080",
        },
        secondary: {
          50: "#fdf2f8",
          500: "#ec4899",
          600: "#db2777",
        },
        accent: {
          50: "#fefce8",
          500: "#f59e42",
          600: "#d97706",
        },
        neutral: {
          50: "#f5f5f5",
          500: "#737373",
          900: "#171717",
        },
        dark: {
          900: "#0f172a",
          800: "#1e293b",
        },
      },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "2rem",
        lg: "3rem",
        xl: "4rem",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
      },
      fontWeight: {
        thin: 100,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
    },
  },
  plugins: [],
};
