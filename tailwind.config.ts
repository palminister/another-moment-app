import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        palm: ["var(--font-palm-serif)", "serif"],
        biorhyme: ["var(--font-biorhyme-expanded)", "serif"],
      },
      colors: {
        app: {
          background: "var(--color-app-background)",
          foreground: "var(--color-app-foreground)",
          muted: "var(--color-app-muted)",
          mutedborder: "var(--color-app-mutedborder)",
          gray: "var(--color-app-gray)",
          grayborder: "var(--color-app-gray-border)",
          darkgray: "var(--color-app-darkgray)",
          darkgrayborder: "var(--color-app-darkgrayborder)",
          border: "var(--color-app-border)",
          surface: "var(--color-app-surface)",
          accent: "var(--color-app-accent)",
          accentborder: "var(--color-app-accentborder)",
          darkblue: "var(--color-app-darkblue)",
          darkblueborder: "var(--color-app-darkblueborder)",
          screen: "var(--color-app-screen)",
          danger: "var(--color-app-danger)",
          yellow: "var(--color-app-yellow)",
          yellowborder: "var(--color-app-yellowborder)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
