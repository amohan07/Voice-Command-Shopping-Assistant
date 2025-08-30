import React from 'react';

function SuggestionCard({ title, items, onPick }) {
  return (
    <div className="border rounded-2xl p-3">
      <div className="text-sm font-medium text-gray-700">{title}</div>
      {(!items || items.length === 0) ? (
        <div className="text-sm text-gray-500 mt-2">No suggestions.</div>
      ) : (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map(item => (
            <button 
              key={item} 
              className="text-sm px-3 py-1 rounded-xl border hover:bg-gray-50" 
              onClick={() => onPick(item, 1)}
            >
              + {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SuggestionCard;