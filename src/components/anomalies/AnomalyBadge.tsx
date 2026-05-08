/**
 * Composant Badge pour afficher la sévérité d'une anomalie
 * RG8: Classification de sévérité (warning/high/critical)
 */
'use client';

import React from 'react';

interface AnomalyBadgeProps {
  severite: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
  className?: string;
}

export default function AnomalyBadge({ severite, className = '' }: AnomalyBadgeProps) {
  /**
   * Mapper les sévérités à des couleurs
   * - BASSE/MOYENNE → amber (warning)
   * - HAUTE → orange (high)
   * - CRITIQUE → red (critical)
   */
  const getColorClasses = () => {
    switch (severite) {
      case 'BASSE':
      case 'MOYENNE':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-300',
          border: 'border-amber-500/20',
          indicator: 'bg-amber-400',
        };
      case 'HAUTE':
        return {
          bg: 'bg-orange-500/10',
          text: 'text-orange-400',
          border: 'border-orange-500/20',
          indicator: 'bg-orange-400',
        };
      case 'CRITIQUE':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          border: 'border-red-500/20',
          indicator: 'bg-red-400 animate-pulse',
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-400',
          border: 'border-gray-500/20',
          indicator: 'bg-gray-400',
        };
    }
  };

  const colors = getColorClasses();
  const displayText = severite.charAt(0) + severite.slice(1).toLowerCase();

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full
        ${colors.bg} ${colors.text} border ${colors.border}
        font-medium text-xs
        ${className}
      `}
    >
      <div className={`w-2 h-2 rounded-full ${colors.indicator}`} />
      {displayText}
    </div>
  );
}
