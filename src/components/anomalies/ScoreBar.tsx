/**
 * Composant ScoreBar pour afficher le score Hugging Face
 * RG8: Barre de progression avec couleur dynamique
 */
'use client';

import React from 'react';

interface ScoreBarProps {
  score: number; // 0.0 → 1.0
  showPercent?: boolean;
  className?: string;
}

export default function ScoreBar({
  score,
  showPercent = true,
  className = '',
}: ScoreBarProps) {
  // Valider le score
  const validScore = Math.max(0, Math.min(1, score));
  const percentage = Math.round(validScore * 100);

  /**
   * Déterminer la couleur basée sur le score
   * - < 60% → cyan (confiance basse)
   * - 60-80% → orange (confiance moyenne)
   * - > 80% → rouge (confiance élevée = risque)
   */
  const getColorClasses = () => {
    if (percentage < 60) {
      return {
        bar: 'bg-cyan-500',
        text: 'text-cyan-400',
      };
    } else if (percentage <= 80) {
      return {
        bar: 'bg-orange-400',
        text: 'text-orange-400',
      };
    } else {
      return {
        bar: 'bg-red-500',
        text: 'text-red-400',
      };
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Barre de progression */}
      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors.bar} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Texte pourcentage */}
      {showPercent && (
        <div className={`${colors.text} font-mono text-sm font-semibold whitespace-nowrap`}>
          {percentage}%
        </div>
      )}
    </div>
  );
}
