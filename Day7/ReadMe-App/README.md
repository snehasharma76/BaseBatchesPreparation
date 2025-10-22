# ReadMe - Crypto Trends from Farcaster

ReadMe is a modern web application that displays trending crypto topics from the Farcaster network and allows users to explore the latest conversations around these topics. The app features a neo-brutalist design aesthetic that is both sleek and distinctive.

## Features

- View trending crypto topics from Farcaster
- See the latest casts (posts) mentioning selected topics
- Refresh trending topics with a single click
- Responsive design that works on both desktop and mobile

## Tech Stack

- React with Vite for fast development
- Tailwind CSS 3 for styling
- Neynar API for Farcaster data
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Neynar API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Neynar API key:
   ```
   VITE_NEYNAR_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
/src
  /assets       # Static assets like images and icons
  /components   # Reusable UI components
  /contexts     # React context providers
  /hooks        # Custom React hooks
  /pages        # Page components
  /services     # API services
  /utils        # Utility functions
```

## License

MIT
