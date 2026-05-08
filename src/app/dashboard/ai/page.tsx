'use client';

/**
 * app/dashboard/ai/page.tsx
 * Page de l'assistant IA SmartMeter.
 * 
 * Utilise ChatInterface pour afficher l'historique et gérer les messages.
 */

import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-brand-dark">
      {/* Header */}
      <div className="border-b border-surface-border bg-brand-dark/50 backdrop-blur px-4 md:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Assistant IA</h1>
          <p className="text-slate-400">
            Posez des questions sur votre consommation électrique
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden max-w-4xl w-full mx-auto">
        <ChatInterface />
      </div>
    </div>
  );
}
