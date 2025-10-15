import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Safari.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert('Microphone access was denied. Please allow microphone access and try again.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isSupported) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
        <p className="text-amber-800 text-sm">
          Voice input is not supported in your browser. Please use the text input below.
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={startListening}
      disabled={isListening}
      className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-medium transition-all ${
        isListening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
      }`}
    >
      {isListening ? (
        <>
          <MicOff className="w-5 h-5" />
          Listening...
        </>
      ) : (
        <>
          <Mic className="w-5 h-5" />
          Tap to speak your grocery list
        </>
      )}
    </button>
  );
}
