/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          red: '#FF5252',       // Bold red (primary background)
          darkRed: '#E63946',   // Darker red for buttons
          white: '#FFFFFF',     // White for text and elements
          black: '#000000',     // Black for outlines and text
          gray: '#F2F2F2',      // Light gray for elements
          darkGray: '#333333',  // Dark gray for text
          accent: '#FFC857',    // Yellow accent
          secondary: '#4ECDC4', // Teal secondary
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'neo': '4px 4px 0 #000000',
        'neo-lg': '8px 8px 0 #000000',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
