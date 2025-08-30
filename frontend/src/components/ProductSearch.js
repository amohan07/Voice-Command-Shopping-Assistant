import React from 'react';
import Search from './Search';

function ProductSearch({ 
  onSearch, 
  searchResults, 
  loading, 
  onAddItem 
}) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <h2 className="text-lg font-semibold">Voice-Activated Search</h2>
      <p className="text-sm text-gray-600">
        Try: "Find organic apples under 5", "Search toothpaste by Colgate", or type below.
      </p>

      <Search onSearch={onSearch} loading={loading} />

      <div className="mt-3">
        {loading && <div className="text-sm text-gray-500">Loading…</div>}
        {!loading && searchResults.length === 0 && (
          <div className="text-sm text-gray-500">No results.</div>
        )}
        <ul className="mt-2 space-y-2">
          {searchResults.map(product => (
            <li key={product.id} className="flex items-center justify-between border rounded-xl px-3 py-2">
              <div>
                <div className="font-medium">
                  {product.name} 
                  <span className="text-xs text-gray-500"> ({product.brand})</span>
                </div>
                <div className="text-xs text-gray-500">
                  ₹{(product.price * 85).toFixed(0)} • ${product.price.toFixed(2)} • {product.unit} • {product.category}
                </div>
              </div>
              <button 
                className="px-3 py-1 text-sm rounded-xl border hover:bg-gray-50" 
                onClick={() => onAddItem(product.name, 1)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProductSearch;