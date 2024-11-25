import React, { useState, useEffect, useCallback } from 'react';
import { Timer, RefreshCw, BarChart2 } from 'lucide-react';

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! The five boxing wizards jump quickly. Sphinx of black quartz, judge my vow.";

interface Stats {
  wpm: number;
  accuracy: number;
  time: number;
}

export default function TypingInterface() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState<Stats>({ wpm: 0, accuracy: 0, time: 0 });

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const endTime = Date.now();
    const timeInMinutes = (endTime - startTime) / 60000;
    const wordsTyped = input.trim().split(' ').length;
    const wpm = Math.round(wordsTyped / timeInMinutes);
    
    let correctChars = 0;
    const minLength = Math.min(input.length, text.length);
    for (let i = 0; i < minLength; i++) {
      if (input[i] === text[i]) correctChars++;
    }
    const accuracy = Math.round((correctChars / text.length) * 100);

    setStats({
      wpm,
      accuracy,
      time: Math.round(timeInMinutes * 60)
    });
  }, [input, text, startTime]);

  useEffect(() => {
    if (input.length === text.length) {
      setIsFinished(true);
      calculateStats();
    }
  }, [input, text, calculateStats]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!startTime) setStartTime(Date.now());
    setInput(e.target.value);
  };

  const resetTest = () => {
    setInput('');
    setStartTime(null);
    setIsFinished(false);
    setStats({ wpm: 0, accuracy: 0, time: 0 });
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'text-gray-600';
      if (index < input.length) {
        className = input[index] === char ? 'text-green-500' : 'text-red-500';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            TypeMaster
          </h1>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-purple-400" />
              <span>{stats.time}s</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-pink-400" />
              <span>{stats.wpm} WPM</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-xl border border-gray-700">
          <div className="text-lg leading-relaxed mb-6 font-mono">
            {renderText()}
          </div>
          
          <textarea
            value={input}
            onChange={handleInputChange}
            disabled={isFinished}
            className="w-full bg-gray-900 text-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono resize-none"
            rows={4}
            placeholder="Start typing..."
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={resetTest}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Reset Test
          </button>

          {isFinished && (
            <div className="bg-gray-800 p-4 rounded-lg flex gap-8">
              <div>
                <div className="text-sm text-gray-400">Speed</div>
                <div className="text-2xl font-bold text-purple-400">{stats.wpm} WPM</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Accuracy</div>
                <div className="text-2xl font-bold text-pink-400">{stats.accuracy}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Time</div>
                <div className="text-2xl font-bold text-blue-400">{stats.time}s</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}