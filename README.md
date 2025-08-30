# Voice Command Shopping Assistant

A full-stack voice-activated shopping assistant built with React frontend and Flask backend.

## Project Structure

```
voice-shopping-assistant/
├── backend/                 # Flask API server
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend documentation
├── frontend/               # React client application
│   ├── public/
│   ├── src/
│   ├── package.json        # Node.js dependencies
│   └── README.md           # Frontend documentation
└── README.md              # This setup guide
```

## Features

🎤 **Voice Recognition** - Natural language voice commands  
🛒 **Shopping List Management** - Add, remove, categorize items  
🔍 **Smart Product Search** - Filter by price, brand, organic  
💡 **Smart Suggestions** - History-based and seasonal recommendations  
🌐 **Multi-language Support** - English and Hindi voice recognition  
📱 **Responsive Design** - Works on desktop and mobile  

## Quick Setup

### Prerequisites

- **Node.js** 16+ (https://nodejs.org/)
- **Python** 3.8+ (https://python.org/)

### 1. Backend Setup (Flask)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

**Backend runs on:** http://localhost:5000

### 2. Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend opens on:** http://localhost:3000

## Voice Commands

- **"Add 2 apples"** - Add items with quantity
- **"Remove milk"** - Remove items from list
- **"Find organic apples under 5"** - Search with filters
- **"Clear list"** - Clear entire shopping list
- **"Set language Hindi"** - Switch to Hindi recognition

## Browser Compatibility

✅ **Best:** Chrome (desktop & mobile)  
✅ **Good:** Microsoft Edge, Safari  
⚠️ **Limited:** Firefox (voice recognition issues)

## API Endpoints

- `GET /api/shopping-list/{user_id}` - Get shopping list
- `POST /api/shopping-list/{user_id}/add` - Add item
- `POST /api/shopping-list/{user_id}/remove` - Remove item
- `POST /api/search` - Search products
- `GET /api/seasonal` - Get seasonal suggestions
- `GET /api/history/{user_id}` - Get purchase history

## Development

Both servers must run simultaneously:
- Backend: Flask development server on port 5000
- Frontend: React development server on port 3000

## Troubleshooting

1. **Microphone Access:** Grant permissions when prompted
2. **CORS Errors:** Ensure Flask-CORS is installed
3. **Voice Recognition:** Use Chrome browser for best results
4. **Port Conflicts:** Check if ports 3000/5000 are available

## Production Deployment

### Backend
- Use Gunicorn WSGI server
- Set up proper database (PostgreSQL/MongoDB)
- Configure environment variables
- Set debug=False

### Frontend
- Build: `npm run build`
- Serve with nginx or static hosting
- Update API URLs for production

