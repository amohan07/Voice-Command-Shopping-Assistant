import React from 'react';

function VoiceControl({ 
  isListening, 
  isSupported, 
  onToggle, 
  transcript, 
  lastAction, 
  error, 
  language, 
  onLanguageChange 
}) {
  return (
    <div>
      {/* Header with language selector and voice button */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">🛒 Voice Command Shopping Assistant</h1>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={e => onLanguageChange(e.target.value)}
            className="border rounded-xl px-3 py-2 text-sm"
            title="Language"
          >
            <option value="en-US">English (en-US)</option>
            <option value="hi-IN">Hindi (hi-IN)</option>
          </select>
          <button
            onClick={onToggle}
            className={`px-4 py-2 rounded-2xl font-medium shadow ${isListening ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}
            aria-pressed={isListening}
            disabled={!isSupported}
          >
            {isListening ? '● Stop' : '🎤 Start'}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <p className="mb-4 text-sm text-gray-600">
        Try: "Add 2 apples", "Remove milk", "Find organic apples under 5", "Set language Hindi"
      </p>

      {/* Browser support warning */}
      {!isSupported && (
        <p className="mb-4 text-sm text-red-600">
          Your browser does not support the Web Speech API. Use Chrome desktop/mobile for best results.
        </p>
      )}

      {/* Voice status section */}
      <section className="mb-6">
        <div className="rounded-2xl border bg-white p-4">
          <div className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full mt-1 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
            <div className="flex-1">
              <div className="text-sm text-gray-500">Heard</div>
              <div className="min-h-[24px] text-base">
                {transcript || <span className="text-gray-400">(waiting...)</span>}
              </div>
            </div>
          </div>
          {lastAction && (
            <div className="mt-3 text-sm text-green-700">✅ {lastAction}</div>
          )}
          {error && (
            <div className="mt-3 text-sm text-red-600">⚠️ {error}</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default VoiceControl;