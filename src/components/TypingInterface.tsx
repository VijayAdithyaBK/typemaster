import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, History, Settings, ChevronRight, X } from 'lucide-react';
import { useTypewriterSounds } from '../hooks/useTypewriterSounds';

const NOVELS = [
  {
    source: "THE GREAT GATSBY",
    text: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing anyone,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.'"
  },
  {
    source: "MOBY DICK",
    text: "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world."
  },
  {
    source: "A TALE OF TWO CITIES",
    text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair."
  },
  {
    source: "NEUROMANCER",
    text: "The sky above the port was the color of television, tuned to a dead channel. It was not that he was an addict, he told himself, but rather that he was a man who required a certain amount of chemical maintenance."
  },
  {
    source: "ANNA KARENINA",
    text: "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys' house. The wife had discovered that the husband was carrying on an intrigue with a French girl."
  },
  {
    source: "1984",
    text: "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions."
  }
];

interface Stats {
  wpm: number;
  accuracy: number;
  time: number;
}

interface HistoryItem extends Stats {
  date: string;
  source: string;
}

export default function TypingInterface() {
  const [mode, setMode] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentNovel, setCurrentNovel] = useState(NOVELS[0]);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [stats, setStats] = useState<Stats>({ wpm: 0, accuracy: 100, time: 0 });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeOverlay, setActiveOverlay] = useState<'logs' | 'config' | null>(null);
  const [settings, setSettings] = useState({ sound: true, smear: false });
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { playClick, playDing } = useTypewriterSounds();

  const initText = useCallback(() => {
    const novel = NOVELS[Math.floor(Math.random() * NOVELS.length)];
    setCurrentNovel(novel);
    setInput("");
    setStartTime(null);
    setIsFinished(false);
    setStats({ wpm: 0, accuracy: 100, time: 0 });
    setActiveOverlay(null);
  }, []);

  useEffect(() => {
    initText();
    const savedHistory = localStorage.getItem('typemaster_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory).slice(0, 10));
    
    const savedSettings = localStorage.getItem('typemaster_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));
  }, [initText]);

  useEffect(() => {
    localStorage.setItem('typemaster_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    let interval: number;
    if (startTime && !isFinished) {
      interval = window.setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 1000;
        setStats(prev => ({ ...prev, time: Math.round(timeElapsed) }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished || activeOverlay) return;
    
    const { value } = e.target;
    if (!startTime && value.length > 0) setStartTime(Date.now());
    
    // Play sound
    if (value.length > input.length && settings.sound) playClick();

    // Calculate accuracy and WPM immediately
    const timeElapsed = startTime ? (Date.now() - startTime) / 1000 : 0.001;
    const words = value.length / 5;
    const currentWpm = Math.round(words / (timeElapsed / 60)) || 0;
    
    const chars = value.split("");
    const correct = chars.filter((c, i) => c === currentNovel.text[i]).length;
    const currentAcc = Math.round((correct / chars.length) * 100) || 100;

    setInput(value);
    setStats({
      wpm: currentWpm,
      accuracy: currentAcc,
      time: Math.round(timeElapsed)
    });

    if (value.length >= currentNovel.text.length) {
      setIsFinished(true);
      if (settings.sound) playDing();
      const finalResult = {
        wpm: currentWpm,
        accuracy: currentAcc,
        time: Math.round(timeElapsed),
        source: currentNovel.source,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const newHistory = [finalResult, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('typemaster_history', JSON.stringify(newHistory));
    }
  };

  const renderText = () => {
    return currentNovel.text.split("").map((char, index) => {
      let className = "ink-char";
      if (index < input.length) {
        className += input[index] === char ? " correct" : " incorrect";
        if (settings.smear && input[index] !== char) className += " shadow-[2px_2px_5px_rgba(185,28,28,0.5)]";
      } else if (index === input.length && !isFinished) {
        className += " active";
      }
      return <span key={index} className={className}>{char}</span>;
    });
  };

  const toggleMode = () => {
    const modes: ('easy' | 'medium' | 'hard')[] = ['easy', 'medium', 'hard'];
    const nextIndex = (modes.indexOf(mode) + 1) % modes.length;
    setMode(modes[nextIndex]);
    if (settings.sound) playClick();
  };

  return (
    <div className="typewriter-container pt-8">
      <div className="w-full max-w-5xl">
        {/* The Paper */}
        <div className="typewriter-paper no-scrollbar">
          <div className="office-header">
            <div className="text-red-800">{currentNovel.source}</div>
            <div>BORING OFFICE</div>
          </div>

          <div className="flex justify-between mb-12 text-[#666] font-bold text-xs uppercase tracking-widest">
            <div className="flex gap-8">
              <span>SPEED: {stats.wpm} WPM</span>
              <span>ACCURACY: {stats.accuracy}%</span>
            </div>
            <div>TIME: {stats.time}S</div>
          </div>

          <div 
            className="relative z-10 cursor-text min-h-[400px]"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="text-2xl leading-[2.2] font-mono mb-10 select-none text-justify">
              {renderText()}
            </div>
            
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              disabled={isFinished || !!activeOverlay}
              className="absolute inset-0 opacity-0 w-full h-full cursor-text"
              autoFocus
            />
            
            {/* Overlays */}
            {activeOverlay === 'logs' && (
              <div className="absolute inset-0 bg-[#fdf6e3] z-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center border-b border-[#2d2d2d] pb-4 mb-6">
                  <span className="text-xl font-bold tracking-widest uppercase">OFFICE LOGS</span>
                  <button onClick={() => setActiveOverlay(null)} className="hover:rotate-90 transition-transform">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  {history.length > 0 ? history.map((item, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-[#2d2d2d]/10 pb-2">
                      <div className="flex flex-col">
                        <span className="font-bold">{item.source}</span>
                        <span className="text-[10px] opacity-40">{item.date}</span>
                      </div>
                      <div className="flex gap-6">
                        <span>{item.wpm} WPM</span>
                        <span>{item.accuracy}% ACC</span>
                      </div>
                    </div>
                  )) : <div className="text-center py-20 opacity-30 italic">LOGBOOK EMPTY</div>}
                </div>
              </div>
            )}

            {activeOverlay === 'config' && (
              <div className="absolute inset-0 bg-[#fdf6e3] z-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center border-b border-[#2d2d2d] pb-4 mb-6">
                  <span className="text-xl font-bold tracking-widest uppercase">CONFIGURATION</span>
                  <button onClick={() => setActiveOverlay(null)} className="hover:rotate-90 transition-transform">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-8 py-10">
                  <div className="flex justify-between items-center border-b border-[#2d2d2d]/10 pb-4">
                    <span className="font-bold tracking-widest uppercase text-xs">AUDIO FEEDBACK</span>
                    <button 
                      onClick={() => setSettings(s => ({ ...s, sound: !s.sound }))}
                      className={`px-4 py-2 rounded text-[10px] font-bold transition-colors ${
                        settings.sound ? 'bg-[#1a1a1a] text-[#fdf6e3]' : 'border border-[#1a1a1a]'
                      }`}
                    >
                      {settings.sound ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#2d2d2d]/10 pb-4">
                    <span className="font-bold tracking-widest uppercase text-xs">VISUAL SMEAR</span>
                    <button 
                      onClick={() => setSettings(s => ({ ...s, smear: !s.smear }))}
                      className={`px-4 py-2 rounded text-[10px] font-bold transition-colors ${
                        settings.smear ? 'bg-[#1a1a1a] text-[#fdf6e3]' : 'border border-[#1a1a1a]'
                      }`}
                    >
                      {settings.smear ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isFinished && !activeOverlay && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fdf6e3]/95 backdrop-blur-[2px] rounded-xl animate-in zoom-in duration-500 z-10">
                <div className="text-5xl font-bold tracking-tighter mb-4 text-[#1a1a1a]">ROLL FINISHED</div>
                <div className="flex gap-12 text-2xl font-mono text-[#666] mb-10">
                  <div>WPM: <span className="text-[#1a1a1a]">{stats.wpm}</span></div>
                  <div>ACC: <span className="text-[#1a1a1a]">{stats.accuracy}%</span></div>
                </div>
                <button 
                  onClick={initText}
                  className="px-10 py-4 bg-[#1a1a1a] text-[#fdf6e3] rounded-lg font-black tracking-[0.2em] hover:scale-105 transition-transform shadow-xl"
                >
                  LOAD NEW PAPER
                </button>
              </div>
            )}

            {!startTime && !isFinished && !activeOverlay && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center gap-4 text-[#2d2d2d] font-bold tracking-[0.3em] opacity-30">
                  <ChevronRight className="w-12 h-12" />
                  <span className="text-sm">STRIKE KEYS TO START MACHINE</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-20 pt-8 border-t border-[#2d2d2d]/10 flex justify-between items-end">
            <div className="text-[10px] uppercase font-bold text-slate-400 space-y-1">
              <div>DEVICE: OMONT MODEL 2026</div>
              <div>LOCATION: BORING OFFICE</div>
            </div>
            
            <div className="flex gap-4">
              {history.length > 0 && (
                <div className="text-[10px] text-right space-y-1">
                  <div className="opacity-40 italic">LATEST: {history[0].wpm}WPM / {history[0].source}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* The Machine Base */}
        <div className="typewriter-machine flex items-center justify-between">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={initText}
              className="typewriter-key group"
            >
              <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
            </button>
            <span className="typewriter-key-label">RESET</span>
          </div>

          <div className="flex items-center gap-20">
             <div className="lever-container">
              <div className="lever-base" onClick={toggleMode}>
                <div className={`lever-handle ${mode}`}>
                  <div className="lever-knob" />
                </div>
              </div>
              <span className="typewriter-key-label">DIFFICULTY: {mode}</span>
            </div>

            <div className="flex flex-col items-center gap-2">
              <button onClick={() => setActiveOverlay('config')} className="typewriter-key">
                <Settings className="w-6 h-6" />
              </button>
              <span className="typewriter-key-label">CONFIG</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button onClick={() => setActiveOverlay('logs')} className="typewriter-key">
              <History className="w-6 h-6" />
            </button>
            <span className="typewriter-key-label">LOGS</span>
          </div>
        </div>
      </div>
    </div>
  );
}