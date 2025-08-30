import React from 'react';
import SuggestionCard from './SuggestionCard';

function SmartSuggestions({ 
  historyItems, 
  seasonalItems, 
  onAddItem 
}) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <h2 className="text-lg font-semibold">Smart Suggestions</h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <SuggestionCard 
          title="Based on History" 
          items={historyItems} 
          onPick={onAddItem} 
        />
        <SuggestionCard 
          title="Seasonal" 
          items={seasonalItems} 
          onPick={onAddItem} 
        />
      </div>
    </div>
  );
}

export default SmartSuggestions;