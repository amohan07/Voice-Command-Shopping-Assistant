from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Static data (in production, this would be from a database)
CATEGORIES = {
    "Dairy": ["milk", "cheese", "yogurt", "butter", "ghee"],
    "Produce": ["apple", "apples", "banana", "bananas", "tomato", "potato", "onion", "spinach", "mango", "orange"],
    "Bakery": ["bread", "bun", "buns"],
    "Beverages": ["water", "soda", "juice", "tea", "coffee"],
    "Snacks": ["chips", "biscuits", "cookies", "namkeen", "chocolate"],
    "Household": ["soap", "detergent", "toothpaste", "shampoo", "tissue"],
    "Other": []
}

SUBSTITUTES = {
    "milk": ["almond milk", "soy milk", "oat milk"],
    "bread": ["whole wheat bread", "multigrain bread"],
    "butter": ["olive spread", "ghee"],
    "sugar": ["jaggery", "stevia"],
    "rice": ["brown rice", "quinoa"],
}

SEASONAL = [
    {"months": [3,4,5,6,7], "items": ["mango", "buttermilk", "watermelon"]},
    {"months": [11,12,1,2], "items": ["jaggery", "groundnuts", "ghee"]},
    {"months": [8,9,10], "items": ["apple", "pomegranate", "guava"]},
]

CATALOG = [
    {"id": str(uuid.uuid4()), "name": "Apples", "brand": "FarmFresh", "price": 3.5, "unit": "kg", "tags": ["organic"], "category": "Produce"},
    {"id": str(uuid.uuid4()), "name": "Apples", "brand": "Daily", "price": 2.8, "unit": "kg", "tags": [], "category": "Produce"},
    {"id": str(uuid.uuid4()), "name": "Milk", "brand": "Amul", "price": 1.0, "unit": "500ml", "tags": [], "category": "Dairy"},
    {"id": str(uuid.uuid4()), "name": "Almond Milk", "brand": "Silk", "price": 2.2, "unit": "1L", "tags": ["vegan"], "category": "Dairy"},
    {"id": str(uuid.uuid4()), "name": "Bread", "brand": "Britannia", "price": 0.9, "unit": "400g", "tags": ["whole wheat"], "category": "Bakery"},
    {"id": str(uuid.uuid4()), "name": "Toothpaste", "brand": "Colgate", "price": 1.5, "unit": "100g", "tags": [], "category": "Household"},
    {"id": str(uuid.uuid4()), "name": "Bananas", "brand": "FarmFresh", "price": 1.2, "unit": "dozen", "tags": [], "category": "Produce"},
    {"id": str(uuid.uuid4()), "name": "Organic Apples", "brand": "Nature's", "price": 4.2, "unit": "kg", "tags": ["organic"], "category": "Produce"},
]

# Simple in-memory storage for demo (in production, use a database)
user_lists = {}
user_history = {}

def categorize_item(item_name):
    """Categorize an item based on its name."""
    name = item_name.lower()
    for cat, words in CATEGORIES.items():
        if any(word in name for word in words):
            return cat
    return "Other"

def get_seasonal_suggestions():
    """Get seasonal suggestions based on current month."""
    current_month = datetime.now().month
    for block in SEASONAL:
        if current_month in block["months"]:
            return block["items"]
    return []

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories."""
    return jsonify(CATEGORIES)

@app.route('/api/substitutes', methods=['GET'])
def get_substitutes():
    """Get substitutes dictionary."""
    return jsonify(SUBSTITUTES)

@app.route('/api/seasonal', methods=['GET'])
def get_seasonal():
    """Get seasonal suggestions."""
    suggestions = get_seasonal_suggestions()
    return jsonify(suggestions)

@app.route('/api/search', methods=['POST'])
def search_products():
    """Search products with filters."""
    data = request.get_json()
    query = data.get('query', '').lower()
    filters = data.get('filters', {})

    # Filter products
    results = []
    for product in CATALOG:
        # Text search
        if query and query not in product['name'].lower() and query not in product['category'].lower():
            continue

        # Brand filter
        if filters.get('brand') and filters['brand'].lower() != product['brand'].lower():
            continue

        # Price filter
        if filters.get('maxPrice') and product['price'] > filters['maxPrice']:
            continue

        # Organic filter
        if filters.get('organic'):
            if 'organic' not in product['tags'] and 'organic' not in product['name'].lower():
                continue

        results.append(product)

    return jsonify(results)

@app.route('/api/shopping-list/<user_id>', methods=['GET'])
def get_shopping_list(user_id):
    """Get user's shopping list."""
    return jsonify(user_lists.get(user_id, []))

@app.route('/api/shopping-list/<user_id>', methods=['POST'])
def update_shopping_list(user_id):
    """Update user's shopping list."""
    data = request.get_json()
    user_lists[user_id] = data.get('items', [])
    return jsonify({"status": "success"})

@app.route('/api/shopping-list/<user_id>/add', methods=['POST'])
def add_item(user_id):
    """Add item to shopping list."""
    data = request.get_json()
    name = data.get('name', '').strip()
    qty = data.get('qty', 1)

    if not name:
        return jsonify({"error": "Item name required"}), 400

    # Initialize user data if not exists
    if user_id not in user_lists:
        user_lists[user_id] = []
    if user_id not in user_history:
        user_history[user_id] = {}

    # Check if item already exists
    existing_item = None
    for item in user_lists[user_id]:
        if item['name'].lower() == name.lower():
            existing_item = item
            break

    if existing_item:
        existing_item['qty'] += qty
    else:
        new_item = {
            "id": str(uuid.uuid4()),
            "name": name,
            "qty": qty,
            "category": categorize_item(name)
        }
        user_lists[user_id].append(new_item)

    # Update history
    user_history[user_id][name.lower()] = user_history[user_id].get(name.lower(), 0) + qty

    return jsonify({"status": "success", "items": user_lists[user_id]})

@app.route('/api/shopping-list/<user_id>/remove', methods=['POST'])
def remove_item(user_id):
    """Remove item from shopping list."""
    data = request.get_json()
    name = data.get('name', '').strip()
    qty = data.get('qty', 1)

    if not name or user_id not in user_lists:
        return jsonify({"error": "Invalid request"}), 400

    # Find and remove item
    for i, item in enumerate(user_lists[user_id]):
        if item['name'].lower() == name.lower():
            item['qty'] -= qty
            if item['qty'] <= 0:
                user_lists[user_id].pop(i)
            break

    return jsonify({"status": "success", "items": user_lists[user_id]})

@app.route('/api/shopping-list/<user_id>/clear', methods=['POST'])
def clear_shopping_list(user_id):
    """Clear user's shopping list."""
    user_lists[user_id] = []
    return jsonify({"status": "success"})

@app.route('/api/history/<user_id>', methods=['GET'])
def get_history(user_id):
    """Get user's shopping history."""
    history = user_history.get(user_id, {})
    # Return top 5 most frequent items
    sorted_history = sorted(history.items(), key=lambda x: x[1], reverse=True)[:5]
    return jsonify([item[0] for item in sorted_history])

@app.route('/api/categorize', methods=['POST'])
def categorize_endpoint():
    """Categorize an item."""
    data = request.get_json()
    item_name = data.get('name', '')
    category = categorize_item(item_name)
    return jsonify({"category": category})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
