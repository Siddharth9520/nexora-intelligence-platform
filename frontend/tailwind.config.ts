import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nexora: {
          // Spatial surfaces
          void: "#070B14",
          lowest: "#070E1E",
          app: "#0C1323",
          sidebar: "#141B2C",
          surface: "#181F30",
          raised: "#232A3B",
          highest: "#2E3446",
          overlay: "#1B2638",
          border: "rgba(148, 175, 214, 0.12)",
          borderElevated: "rgba(148, 175, 214, 0.24)",
          
          // Content
          text: "#DCE2F9",
          textSecondary: "#C8C4D7",
          textMuted: "#928EA0",
          textSubtle: "#5F7391",
          
          // Semantic epistemic accents
          purple: "#8C80FF",
          purpleActive: "#7C6CFF",
          purpleBright: "#C6BFFF",
          cyan: "#5DE6FF",
          cyanFact: "#22D3EE",
          ice: "#A5D8FF",
          teal: "#35D6C5",
          amber: "#FFB957",
          amberLead: "#F5A524",
          green: "#35C98A",
          red: "#FF647C",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Geist", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "Monaco", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
