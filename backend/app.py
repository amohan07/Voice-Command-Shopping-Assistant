from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import uuid
import os
from datetime import datetime

# -------------------------------
# Find absolute path to frontend/build
# -------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend", "build")

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="/")
CORS(app)

# ===============================
# Your Existing Backend Logic (unchanged)
# ===============================

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
    {"months": [3, 4, 5, 6, 7], "items": ["mango", "buttermilk", "watermelon"]},
    {"months": [11, 12, 1, 2], "items": ["jaggery", "groundnuts", "ghee"]},
    {"months": [8, 9, 10], "items": ["apple", "pomegranate", "guava"]},
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

user_lists = {}
user_history = {}

def categorize_item(item_name):
    name = item_name.lower()
    for cat, words in CATEGORIES.items():
        if any(word in name for word in words):
            return cat
    return "Other"

def get_seasonal_suggestions():
    current_month = datetime.now().month
    for block in SEASONAL:
        if current_month in block["months"]:
            return block["items"]
    return []

# ===============================
# API Routes (unchanged)
# ===============================
@app.route('/api/categories', methods=['GET'])
def get_categories():
    return jsonify(CATEGORIES)

@app.route('/api/substitutes', methods=['GET'])
def get_substitutes():
    return jsonify(SUBSTITUTES)

@app.route('/api/seasonal', methods=['GET'])
def get_seasonal():
    return jsonify(get_seasonal_suggestions())

@app.route('/api/search', methods=['POST'])
def search_products():
    data = request.get_json()
    query = data.get('query', '').lower()
    filters = data.get('filters', {})

    results = []
    for product in CATALOG:
        if query and query not in product['name'].lower() and query not in product['category'].lower():
            continue
        if filters.get('brand') and filters['brand'].lower() != product['brand'].lower():
            continue
        if filters.get('maxPrice') and product['price'] > filters['maxPrice']:
            continue
        if filters.get('organic'):
            if 'organic' not in product['tags'] and 'organic' not in product['name'].lower():
                continue
        results.append(product)

    return jsonify(results)

@app.route('/api/shopping-list/<user_id>', methods=['GET'])
def get_shopping_list(user_id):
    return jsonify(user_lists.get(user_id, []))

@app.route('/api/shopping-list/<user_id>', methods=['POST'])
def update_shopping_list(user_id):
    data = request.get_json()
    user_lists[user_id] = data.get('items', [])
    return jsonify({"status": "success"})

@app.route('/api/shopping-list/<user_id>/add', methods=['POST'])
def add_item(user_id):
    data = request.get_json()
    name = data.get('name', '').strip()
    qty = data.get('qty', 1)

    if not name:
        return jsonify({"error": "Item name required"}), 400

    if user_id not in user_lists:
        user_lists[user_id] = []
    if user_id not in user_history:
        user_history[user_id] = {}

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

    user_history[user_id][name.lower()] = user_history[user_id].get(name.lower(), 0) + qty

    return jsonify({"status": "success", "items": user_lists[user_id]})

@app.route('/api/shopping-list/<user_id>/remove', methods=['POST'])
def remove_item(user_id):
    data = request.get_json()
    name = data.get('name', '').strip()
    qty = data.get('qty', 1)

    if not name or user_id not in user_lists:
        return jsonify({"error": "Invalid request"}), 400

    for i, item in enumerate(user_lists[user_id]):
        if item['name'].lower() == name.lower():
            item['qty'] -= qty
            if item['qty'] <= 0:
                user_lists[user_id].pop(i)
            break

    return jsonify({"status": "success", "items": user_lists[user_id]})

@app.route('/api/shopping-list/<user_id>/clear', methods=['POST'])
def clear_shopping_list(user_id):
    user_lists[user_id] = []
    return jsonify({"status": "success"})

@app.route('/api/history/<user_id>', methods=['GET'])
def get_history(user_id):
    history = user_history.get(user_id, {})
    sorted_history = sorted(history.items(), key=lambda x: x[1], reverse=True)[:5]
    return jsonify([item[0] for item in sorted_history])

@app.route('/api/categorize', methods=['POST'])
def categorize_endpoint():
    data = request.get_json()
    item_name = data.get('name', '')
    category = categorize_item(item_name)
    return jsonify({"category": category})

# ===============================
# React Frontend Serving
# ===============================
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

# ===============================
# Run App
# ===============================
if __name__ == '__main__':
    app.run(debug=True, port=5000)
