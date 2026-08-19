import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import confetti from 'canvas-confetti';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onSimulateSuccess?: () => void;
  onSimulatePro?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onSimulateSuccess,
  onSimulatePro,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const perks = [
    'Unlimited AI Repurposing Generations',
    'Full Multi-Platform Distribution Asset Pack',
    'Priority Google Gemini 1.5 Flash Processing Speed',
    'Export to Styled PDF, Markdown & JSON',
    'Custom Audience Tone & Creator Personas',
    'Unlimited Saved Generation History & Library',
  ];

  const handleStripeCheckout = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, userEmail }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Stripe checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatePro = async () => {
    if (onSimulatePro) {
      onSimulatePro();
      return;
    }
    try {
      setIsSimulating(true);
      const res = await fetch('/api/dev/simulate-pro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, setPro: true }),
      });
      if (res.ok) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // Confetti fallback
        }
        if (onSimulateSuccess) onSimulateSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚡ Upgrade to RepurposeAI Pro" maxWidth="lg">
      <div className="space-y-6">
        
        {/* Value Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-zinc-900 border border-indigo-500/40 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scale Your Content Reach</span>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            $19 <span className="text-sm font-normal text-zinc-400">/ month</span>
          </div>
          <p className="text-xs text-zinc-300">
            Cancel anytime &bull; Instant activation via Stripe Billing
          </p>
        </div>

        {/* Feature List */}
        <div className="space-y-2.5">
          {perks.map((perk, i) => (
            <div key={i} className="flex items-center gap-3 text-xs text-zinc-200">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>{perk}</span>
            </div>
          ))}
        </div>

        {/* Primary Checkout Button */}
        <Button
          onClick={handleStripeCheckout}
          isLoading={isLoading}
          size="lg"
          className="w-full font-bold shadow-xl shadow-indigo-600/30"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          <span>Subscribe with Stripe Checkout ($19/mo)</span>
        </Button>

        {/* Recruiter / Sandbox Simulation Sandbox Button */}
        <div className="pt-2 border-t border-zinc-800 text-center">
          <button
            type="button"
            onClick={handleSimulatePro}
            disabled={isSimulating}
            className="text-xs text-zinc-400 hover:text-indigo-300 transition-colors font-medium underline"
          >
            {isSimulating ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" /> Activating Pro Demo...
              </span>
            ) : (
              '🛠️ Reviewer Mode: Simulate Instant Pro Activation (No Card Required)'
            )}
          </button>
        </div>

      </div>
    </Modal>
  );
};
