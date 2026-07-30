/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "ink-navy": "#101A2E",
        "mist-white": "#F6F8FA",
        "pulse-violet": "#6D5DF6",
        "pulse-violet-soft": "#EFECFE",
        "clinical-teal": "#12897F",
        "clinical-teal-soft": "#E4F3F1",
        "amber-flag": "#E8A33D",
        "amber-flag-soft": "#FCF1DE",
        "alert-coral": "#E15554",
        "alert-coral-soft": "#FCEAEA",
        "slate-gray": "#5B6B82",
        "line-gray": "#E3E8EE",
        // Dark console surface variants
        "console-bg": "#0B1220",
        "console-surface": "#131C2E",
        "console-text": "#E8ECF3",
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "Consolas", "monospace"],
      },
      fontSize: {
        "display-xl": ["40px", { lineHeight: "1.1", fontWeight: "600" }],
        "display-lg": ["32px", { lineHeight: "1.15", fontWeight: "600" }],
        "display-md": ["24px", { lineHeight: "1.2", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        "body-md": ["16px", { lineHeight: "1.6" }],
        "body-sm": ["14px", { lineHeight: "1.5" }],
        "data-md": ["15px", { lineHeight: "1.4", fontWeight: "500" }],
        "data-sm": ["13px", { lineHeight: "1.4" }],
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        12: "48px",
        16: "64px",
      },
      boxShadow: {
        float: "0 4px 24px rgba(16,26,46,0.12)",
        modal: "0 8px 48px rgba(16,26,46,0.18)",
      },
      animation: {
        "waveform-pulse": "waveform 1.4s ease-in-out infinite",
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        waveform: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
