import React, { useState, useEffect, useCallback } from 'react';
import apiService from './services/api';
import { parseCommand, useSpeechRecognition, DEFAULT_LANG } from './utils/voiceUtils';
import VoiceControl from './components/VoiceControl';
import ShoppingList from './components/ShoppingList';
import SmartSuggestions from './components/SmartSuggestions';
import ProductSearch from './components/ProductSearch';

function App() {
  // State management
  const [list, setList] = useState([]);
  const [history, setHistory] = useState([]);
  const [seasonalItems, setSeasonalItems] = useState([]);
  const [substitutes, setSubstitutes] = useState({});
  const [language, setLanguage] = useState(DEFAULT_LANG);
  const [transcript, setTranscript] = useState("");
  const [lastAction, setLastAction] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Voice recognition callbacks
  const onSpeechResult = useCallback((text, isFinal) => {
    setTranscript(text);
    if (isFinal) {
      handleCommand(text);
    }
  }, []);

  const onSpeechError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  // Speech recognition hook
  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition(language, onSpeechResult, onSpeechError);

  // Load initial data
  useEffect(() => {
    loadShoppingList();
    loadHistory();
    loadSeasonalSuggestions();
    loadSubstitutes();
  }, []);

  // Calculate substitutes based on current list
  useEffect(() => {
    calculateSubstitutes();
  }, [list, substitutes]);

  const loadShoppingList = async () => {
    try {
      const response = await apiService.getShoppingList();
      setList(response.data || []);
    } catch (err) {
      console.error('Error loading shopping list:', err);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await apiService.getHistory();
      setHistory(response.data || []);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const loadSeasonalSuggestions = async () => {
    try {
      const response = await apiService.getSeasonalSuggestions();
      setSeasonalItems(response.data || []);
    } catch (err) {
      console.error('Error loading seasonal suggestions:', err);
    }
  };

  const loadSubstitutes = async () => {
    try {
      const response = await apiService.getSubstitutes();
      setSubstitutes(response.data || {});
    } catch (err) {
      console.error('Error loading substitutes:', err);
    }
  };

  const calculateSubstitutes = () => {
    const missing = [];
    for (const item of list) {
      const subs = substitutes[item.name.toLowerCase()];
      if (subs && subs.length) {
        missing.push({ base: item.name, subs });
      }
    }
    return missing;
  };

  const addItem = async (name, qty = 1) => {
    try {
      const response = await apiService.addItem(name, qty);
      if (response.data.items) {
        setList(response.data.items);
        setLastAction(`Added ${qty} × ${name}`);
        loadHistory(); // Refresh history
      }
    } catch (err) {
      setError('Error adding item: ' + (err.response?.data?.error || err.message));
    }
  };

  const removeItem = async (name, qty = 1) => {
    try {
      const response = await apiService.removeItem(name, qty);
      if (response.data.items) {
        setList(response.data.items);
        setLastAction(`Removed ${qty} × ${name}`);
      }
    } catch (err) {
      setError('Error removing item: ' + (err.response?.data?.error || err.message));
    }
  };

  const clearList = async () => {
    try {
      await apiService.clearShoppingList();
      setList([]);
      setLastAction("Cleared list");
    } catch (err) {
      setError('Error clearing list: ' + (err.response?.data?.error || err.message));
    }
  };

  const runSearch = async (query, filters = {}) => {
    setLoading(true);
    setError("");
    try {
      const response = await apiService.searchProducts(query, filters);
      setSearchResults(response.data || []);
      setLastAction(`Searching for "${query}"`);
    } catch (err) {
      setError('Search error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCommand = (text) => {
    const cmd = parseCommand(text);
    if (!cmd) return;

    switch (cmd.type) {
      case "setLanguage":
        setLanguage(cmd.lang);
        setLastAction(`Language set to ${cmd.lang}`);
        break;
      case "add":
        addItem(cmd.item, cmd.qty);
        break;
      case "remove":
        removeItem(cmd.item, cmd.qty);
        break;
      case "search":
        runSearch(cmd.query, cmd.filters);
        break;
      case "clear":
        clearList();
        break;
      case "unknown":
        setLastAction(`Didn't understand: "${cmd.raw}"`);
        break;
      default:
        break;
    }
  };

  const toggleMic = () => {
    setError("");
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const substitutesForList = calculateSubstitutes();

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col">
      <header className="px-4 py-4 sticky top-0 bg-white/80 backdrop-blur border-b">
        <VoiceControl
          isListening={isListening}
          isSupported={isSupported}
          onToggle={toggleMic}
          transcript={transcript}
          lastAction={lastAction}
          error={error}
          language={language}
          onLanguageChange={setLanguage}
        />
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ShoppingList
            list={list}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onClearList={clearList}
            substitutes={substitutesForList}
            onAddFromSubstitutes={addItem}
          />

          <SmartSuggestions
            historyItems={history}
            seasonalItems={seasonalItems}
            onAddItem={addItem}
          />
        </section>

        <section className="mt-6">
          <ProductSearch
            onSearch={runSearch}
            searchResults={searchResults}
            loading={loading}
            onAddItem={addItem}
          />
        </section>
      </main>

      <footer className="px-4 py-6 bg-white border-t">
        <div className="text-xs text-gray-500">
          Built with React + Flask • Works best in Chrome • Voice-activated shopping assistant
        </div>
      </footer>
    </div>
  );
}

export default App;