# Voice Shopping Assistant - Backend

Flask backend API for the Voice Command Shopping Assistant.

## Features

- RESTful API for shopping list management
- Product search with filters (price, brand, organic)
- User-specific shopping lists and history
- Smart suggestions (seasonal items, substitutes)
- CORS enabled for frontend integration

## Installation

1. Create virtual environment:
   ```bash
   python -m venv venv

   # Windows
   venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```bash
   python app.py
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Shopping List
- `GET /api/shopping-list/{user_id}` - Get user's shopping list
- `POST /api/shopping-list/{user_id}/add` - Add item to list
- `POST /api/shopping-list/{user_id}/remove` - Remove item from list
- `POST /api/shopping-list/{user_id}/clear` - Clear entire list

### Product Search
- `POST /api/search` - Search products with filters

### Suggestions
- `GET /api/categories` - Get item categories
- `GET /api/substitutes` - Get substitute items
- `GET /api/seasonal` - Get seasonal suggestions
- `GET /api/history/{user_id}` - Get user's purchase history
