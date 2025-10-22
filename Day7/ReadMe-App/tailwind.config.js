/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e6f0fd',
          200: '#d1e3fa',
          300: '#a9cdf6',
          400: '#7db0f0',
          500: '#5a91e8',  // Main blue
          600: '#4173db',
          700: '#355cc7',
          800: '#2f4ba2',
          900: '#2c4281',
          950: '#1d2a4d',
        },
        accent: {
          50: '#fff1f0',
          100: '#ffe4e1',
          200: '#ffccc7',
          300: '#ffa69e',
          400: '#ff7a6c',  // Coral accent
          500: '#ff5349',  // Main coral
          600: '#ea3326',
          700: '#d42a1f',
          800: '#aa251e',
          900: '#8c241f',
          950: '#4b0f0c',
        },
        neo: {
          blue: '#5a91e8',     // Main blue
          coral: '#ff5349',     // Main coral
          yellow: '#ffbe0b',    // Bright yellow
          green: '#00b894',     // Mint green
          purple: '#9b59b6',    // Soft purple
          black: '#222222',     // Almost black
          white: '#ffffff',     // Pure white
          offwhite: '#f9f9f9',  // Off-white
          gray: '#e0e0e0',      // Light gray
        },
        dark: '#222222',        // Almost black
        light: '#ffffff',       // Pure white
        paper: '#f9f9f9',       // Off-white
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sleek': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'sleek-sm': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'sleek-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'sleek-xl': '0 12px 32px rgba(0, 0, 0, 0.1)',
        'brutal': '4px 4px 0px 0px rgba(0,0,0,0.9)',
        'brutal-sm': '3px 3px 0px 0px rgba(0,0,0,0.9)',
        'brutal-colored': '4px 4px 0px 0px #5a91e8',
        'brutal-accent': '4px 4px 0px 0px #ff5349',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}

