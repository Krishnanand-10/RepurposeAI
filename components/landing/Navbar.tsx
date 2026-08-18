import React from 'react';
import { Sparkles, ArrowRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  onLaunchStudio: () => void;
  onScrollToPricing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLaunchStudio, onScrollToPricing }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-extrabold text-white tracking-tight">
            Repurpose<span className="text-indigo-400">AI</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How it Works
          </a>
          <button onClick={onScrollToPricing} className="hover:text-white transition-colors">
            Pricing
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLaunchStudio}
            className="text-zinc-300 hover:text-white"
          >
            Sign In
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onLaunchStudio}
            className="shadow-md shadow-indigo-600/25"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Launch Studio
          </Button>
        </div>

      </div>
    </header>
  );
};
