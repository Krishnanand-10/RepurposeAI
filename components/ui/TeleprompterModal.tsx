import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Maximize, X } from 'lucide-react';
import { Modal } from './Modal';

interface TeleprompterModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptContent: string;
  hookTitle: string;
}

export const TeleprompterModal: React.FC<TeleprompterModalProps> = ({
  isOpen,
  onClose,
  scriptContent,
  hookTitle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); // 1 to 5
  const [fontSize, setFontSize] = useState(28); // 20 to 48
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && textRef.current) {
      interval = setInterval(() => {
        if (textRef.current) {
          textRef.current.scrollTop += speed;
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const handleReset = () => {
    setIsPlaying(false);
    if (textRef.current) {
      textRef.current.scrollTop = 0;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎬 Recording Teleprompter" maxWidth="2xl">
      <div className="space-y-4">
        
        {/* Hook indicator */}
        <div className="px-4 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          Hook: "{hookTitle}"
        </div>

        {/* Teleprompter Scrolling Viewport */}
        <div
          ref={textRef}
          className="h-80 overflow-y-auto p-6 rounded-2xl bg-black border border-zinc-800 text-white font-medium leading-relaxed select-none scroll-smooth"
          style={{ fontSize: `${fontSize}px` }}
        >
          <div className="py-20 text-center whitespace-pre-line text-zinc-100">
            {scriptContent}
          </div>
        </div>

        {/* Teleprompter Controls */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex-wrap gap-3">
          {/* Play / Pause / Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'Pause' : 'Start Scroll'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              title="Reset to Top"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed & Font Adjustments */}
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span>Speed:</span>
              <input
                type="range"
                min={1}
                max={5}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-20 accent-indigo-500 cursor-pointer"
              />
              <span className="font-mono text-zinc-200">{speed}x</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Text:</span>
              <button
                onClick={() => setFontSize((s) => Math.max(20, s - 4))}
                className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-bold"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(48, s + 4))}
                className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-bold"
              >
                A+
              </button>
            </div>
          </div>
        </div>

      </div>
    </Modal>
  );
};
