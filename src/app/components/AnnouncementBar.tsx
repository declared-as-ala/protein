'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-gradient-to-r from-red-600 to-red-700 text-white relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2 text-sm md:text-base">
            <span className="font-semibold">🎉 Promotion spéciale !</span>
            <span className="hidden sm:inline">Livraison gratuite à partir de 300 DT</span>
            <span className="hidden md:inline">+ -15% sur votre première commande avec le code:</span>
            <code className="hidden md:inline bg-white/20 px-2 py-1 rounded font-mono">WELCOME15</code>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
