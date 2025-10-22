# TouchGrass - Screen Time Alert Application

![TouchGrass Logo](/public/favicon.svg)

TouchGrass is a retro-themed screen time alert application designed to help users manage their digital device usage. When the set time limit expires, the app plays fun video clips and requires users to solve simple math challenges before continuing their screen time.

## Features

- 🕒 Customizable screen time limits
- 🎮 Retro-themed UI design
- 🎬 Random funny video clips as alarms
- 🧮 Math challenges to dismiss alarms
- 💾 Persistent settings using localStorage

## Tech Stack

- React 18
- Vite
- React Router DOM
- Tailwind CSS 3
- React Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/touchGrass.git
   cd touchGrass
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
/src
  /assets        # Static assets like images and videos
  /components    # Reusable UI components
  /context       # React context for state management
  /hooks         # Custom React hooks
  /pages         # Page components
  /utils         # Utility functions
```

## Usage

1. Set your desired screen time limit in the Settings page
2. Start the timer on the Timer page
3. When time runs out, a video alarm will play
4. Solve the math challenges to dismiss the alarm

## License

MIT
