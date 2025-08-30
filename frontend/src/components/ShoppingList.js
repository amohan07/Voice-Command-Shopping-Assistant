import React from 'react';
import ManualAdd from './ManualAdd';

function ShoppingList({ 
  list, 
  onAddItem, 
  onRemoveItem, 
  onClearList, 
  substitutes, 
  onAddFromSubstitutes 
}) {
  // Group items by category
  const categorized = React.useMemo(() => {
    const map = {};
    for (const item of list) {
      if (!map[item.category]) {
        map[item.category] = [];
      }
      map[item.category].push(item);
    }
    return map;
  }, [list]);

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Shopping List</h2>
        <button 
          onClick={onClearList} 
          className="text-sm px-3 py-1 rounded-xl border hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

      {Object.keys(categorized).length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">
          No items yet. Say "Add milk" or use the box below.
        </p>
      ) : (
        <div className="mt-3 space-y-4">
          {Object.entries(categorized).map(([category, items]) => (
            <div key={category}>
              <div className="font-medium text-gray-700 mb-2">{category}</div>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">Qty: {item.qty}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        className="px-2 py-1 text-sm rounded-lg border hover:bg-gray-50" 
                        onClick={() => onRemoveItem(item.name, 1)}
                      >
                        -1
                      </button>
                      <button 
                        className="px-2 py-1 text-sm rounded-lg border hover:bg-gray-50" 
                        onClick={() => onAddItem(item.name, 1)}
                      >
                        +1
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Manual add section */}
      <ManualAdd onAdd={onAddItem} />

      {/* Substitutes section */}
      {substitutes && substitutes.length > 0 && (
        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Substitutes</div>
          <ul className="space-y-2">
            {substitutes.map(s => (
              <li key={s.base} className="text-sm flex items-center justify-between rounded-xl border px-3 py-2">
                <span>
                  <span className="font-medium">{s.base}</span>: {s.subs.join(', ')}
                </span>
                <div className="flex gap-2">
                  {s.subs.map(sub => (
                    <button 
                      key={sub} 
                      className="text-xs px-2 py-1 rounded-lg border hover:bg-gray-50" 
                      onClick={() => onAddFromSubstitutes(sub, 1)}
                    >
                      + {sub}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ShoppingList;