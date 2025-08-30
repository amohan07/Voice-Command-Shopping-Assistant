import React from 'react';

export const DEFAULT_LANG = "en-US";

// Parse commands from free text (lightweight NLP for demo)
export function parseCommand(textRaw) {
  if (!textRaw) return null;
  const text = textRaw.trim().toLowerCase();

  // Language switching
  const langMatch = text.match(/(set|switch) (language|lang) (to )?(english|hindi|en|hi|en-us|hi-in)/);
  if (langMatch) {
    const langWord = langMatch[4];
    let lang = DEFAULT_LANG;
    if (/(hindi|hi|hi-in)/.test(langWord)) lang = "hi-IN";
    if (/(english|en|en-us)/.test(langWord)) lang = "en-US";
    return { type: "setLanguage", lang };
  }

  // Remove flow: "remove milk", "delete 2 apples"
  const removeRe = /\b(remove|delete|drop)\b\s+(\d+\s+)?([a-zA-Z ]+)/;
  const rem = text.match(removeRe);
  if (rem) {
    const qty = rem[2] ? parseInt(rem[2]) : 1;
    const item = rem[3].trim();
    return { type: "remove", item, qty };
  }

  // Add/buy flow: variants like "add milk", "i need 2 apples", "buy 5 oranges"
  const addRe = /\b(add|buy|need|want|purchase|get)\b\s+(\d+\s+)?([a-zA-Z ]+)/;
  const add = text.match(addRe);
  if (add) {
    const qty = add[2] ? parseInt(add[2]) : 1;
    const item = add[3].trim();
    return { type: "add", item, qty };
  }

  // Search flow: "find organic apples under $5", "search toothpaste under 100 rupees by colgate"
  const searchRe = /\b(find|search|look\s*for)\b\s+(.*)/;
  const s = text.match(searchRe);
  if (s) {
    const q = s[2].trim();
    // Extract filters
    const underPrice = q.match(/under\s*\$?(\d+(?:\.\d+)?)/);
    const brand = (q.match(/by\s+([a-zA-Z']+)/) || [])[1];
    const organic = /\borganic\b/.test(q);
    let item = q
      .replace(/under\s*\$?\d+(?:\.\d+)?/, "")
      .replace(/by\s+[a-zA-Z']+/, "")
      .replace(/\borganic\b/, "")
      .trim();
    if (!item) item = q;
    return {
      type: "search",
      query: item,
      filters: {
        maxPrice: underPrice ? parseFloat(underPrice[1]) : undefined,
        brand: brand || undefined,
        organic: organic || undefined,
      }
    };
  }

  // Clear list
  if (/\b(clear|reset) (list|all)\b/.test(text)) return { type: "clear" };

  return { type: "unknown", raw: textRaw };
}

// Speech recognition hook
export function useSpeechRecognition(language, onResult, onError) {
  const recognitionRef = React.useRef(null);
  const [isListening, setIsListening] = React.useState(false);
  const [isSupported, setIsSupported] = React.useState(true);

  React.useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + " ";
        } else {
          onResult(result[0].transcript, false);
        }
      }
      if (finalText.trim()) {
        onResult(finalText.trim(), true);
      }
    };

    recognition.onerror = (event) => {
      onError(event.error || "Speech error");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
    };
  }, [language, onResult, onError]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      onError(String(e));
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (e) {
      onError(String(e));
    }
  };

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
  };
}