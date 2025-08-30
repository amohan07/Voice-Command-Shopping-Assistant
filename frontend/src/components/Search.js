import React, { useState } from 'react';

function Search({ onSearch, loading }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [organic, setOrganic] = useState(false);

  const handleSearch = () => {
    const filters = {};
    if (brand) filters.brand = brand;
    if (maxPrice) filters.maxPrice = parseFloat(maxPrice);
    if (organic) filters.organic = organic;

    onSearch(query, filters);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <input 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder="Query (e.g., apples)" 
          className="border rounded-xl px-3 py-2 text-sm" 
        />
        <input 
          value={brand} 
          onChange={e => setBrand(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder="Brand (optional)" 
          className="border rounded-xl px-3 py-2 text-sm" 
        />
        <input 
          value={maxPrice} 
          onChange={e => setMaxPrice(e.target.value)} 
          onKeyPress={handleKeyPress}
          type="number" 
          min="0" 
          step="0.1" 
          placeholder="Max $ price" 
          className="border rounded-xl px-3 py-2 text-sm" 
        />
        <label className="flex items-center gap-2 text-sm border rounded-xl px-3 py-2">
          <input 
            type="checkbox" 
            checked={organic} 
            onChange={e => setOrganic(e.target.checked)} 
          /> 
          Organic
        </label>
      </div>
      <div>
        <button 
          disabled={loading} 
          onClick={handleSearch} 
          className="px-4 py-2 rounded-2xl bg-indigo-600 text-white disabled:opacity-60 hover:bg-indigo-700"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </div>
  );
}

export default Search;