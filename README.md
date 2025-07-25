# Wordle Game

A React-based clone of the popular Wordle game with daily word challenges and additional features.

## Features

Daily Words: New word every 24 hours, synchronized for all players
Skip Day: Option to advance to next day's word without waiting
Game Statistics: Track wins, streaks, and guess distribution
Dark Mode: Toggle between light and dark themes
Share Results: Share your results with emoji grid
Responsive Design: Works on desktop and mobile devices
Keyboard Support**: Both virtual and physical keyboard input

## How to Play

1. Guess the 5-letter word in 6 attempts
2. Type letters using keyboard or click virtual keys
3. Press Enter to submit your guess
4. Use Backspace to delete letters

### Color Guide

- 🟩 Green: Correct letter in correct position
- 🟨 Yellow: Correct letter in wrong position
- ⬛ Gray: Letter not in the word

## Installation

### Clone the repository

git clone [repository-url]

### Navigate to project directory

cd Wordle-Gp14

### Install dependencies

npm install

### Start development server

npm run dev

## Tech Stack

- React 19.1.0
- Vite - Build tool
- FontAwesome - Icons
- CSS - Styling with dark mode support

## Game Controls

- Next: Start new game with current daily word
- Retry: Restart current game with same word
- Skip Day: Advance to next day's word
- Help: View game instructions
- Settings: Toggle dark mode and difficulty

## Development

## Run development server

npm run dev

## Build for production

npm run build

## Preview production build

npm run preview

## Run linter

npm run lint

## File Structure

src/
├── components/
│   ├── AlertMessage.jsx    # Win/lose notifications
│   ├── GameSettings.jsx    # Settings modal
│   ├── GuessGrid.jsx       # 6x5 game grid
│   ├── Help.jsx           # Game instructions
│   ├── Keyboard.jsx       # Virtual keyboard
│   ├── LetterBox.jsx      # Individual letter cells
│   ├── Navbar.jsx         # Navigation bar
│   ├── ShareResult.jsx    # Share functionality
│   └── Stats.jsx          # Statistics modal
├── App.jsx                # Main game logic
├── db.json               # Word database
└── main.jsx              # App entry point

## Author

Newton Orina
Eric Muigai
Weldon Macharia
Bright Villa

## License

This project is for educational purposes.