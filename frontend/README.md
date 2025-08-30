# Voice Shopping Assistant - Frontend

React frontend for the Voice Command Shopping Assistant with voice recognition capabilities.

## Features

- Voice recognition for hands-free shopping list management
- Real-time speech-to-text with command parsing
- Product search with advanced filters
- Smart suggestions (history-based, seasonal)
- Responsive design with Tailwind CSS
- Multi-language support (English, Hindi)

## Voice Commands

### Adding Items
- "Add milk"
- "Buy 2 apples"
- "I need 5 oranges"

### Removing Items
- "Remove milk"
- "Delete 2 apples"

### Searching Products
- "Find organic apples under 5"
- "Search toothpaste by Colgate"

### List Management
- "Clear list"
- "Reset all"

### Language Switching
- "Set language Hindi"
- "Switch to English"

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The app will open on `http://localhost:3000`

## Dependencies

- React 18.2.0
- Axios for API communication
- Tailwind CSS for styling
- Web Speech API for voice recognition

## Browser Support

Works best with Chrome desktop/mobile for optimal voice recognition support.

## Configuration

The frontend expects the backend API to be running on `http://localhost:5000`. This is configured in `package.json` as a proxy.
