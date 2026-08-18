import React, { useState } from 'react';
import { Key, User, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onResetCredits: () => void;
  onSavedToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onResetCredits,
  onSavedToast,
}) => {
  const [apiKey, setApiKey] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('repurpose_gemini_key') || '' : ''
  );

  const handleSaveApiKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('repurpose_gemini_key', apiKey.trim());
      onSavedToast('Gemini API key saved locally!');
      onClose();
    }
  };

  const handleResetCredits = async () => {
    try {
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, resetCredits: true }),
      });
      onResetCredits();
      onSavedToast('Free credits reset to 0/3 for testing!');
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚙️ Workspace Settings" maxWidth="md">
      <div className="space-y-6">
        
        {/* Custom API Key Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Key className="w-3.5 h-3.5 text-indigo-400" />
            <span>Google Gemini API Key (Optional)</span>
          </label>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            By default, RepurposeAI uses high-fidelity AI generation out-of-the-box. You can also provide your own custom Gemini API key.
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Developer Sandbox Reset */}
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-850 space-y-3">
          <span className="text-xs font-bold text-zinc-300 block">
            🛠️ Reviewer Testing Controls
          </span>
          <p className="text-[11px] text-zinc-400">
            Reset this workspace's free tier counter to test the 3-generation paywall flow again.
          </p>
          <button
            type="button"
            onClick={handleResetCredits}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Free Credits to 0/3</span>
          </button>
        </div>

        {/* Save Button */}
        <Button onClick={handleSaveApiKey} className="w-full font-bold">
          <span>Save Preferences</span>
        </Button>

      </div>
    </Modal>
  );
};
