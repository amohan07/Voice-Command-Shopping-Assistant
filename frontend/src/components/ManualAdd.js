import React, { useState } from 'react';

function ManualAdd({ onAdd }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), qty);
      setName("");
      setQty(1);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div className="mt-4">
      <div className="text-sm font-medium text-gray-700 mb-2">Manual Add</div>
      <div className="flex items-center gap-2">
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder="Item name"
          className="flex-1 border rounded-xl px-3 py-2 text-sm" 
        />
        <input 
          type="number" 
          min={1} 
          value={qty} 
          onChange={e => setQty(parseInt(e.target.value) || 1)}
          className="w-24 border rounded-xl px-3 py-2 text-sm" 
        />
        <button 
          className="px-3 py-2 text-sm rounded-xl border hover:bg-gray-50" 
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default ManualAdd;