'use client';

/**
 * ChatInterface.tsx
 * Interface de conversation IA complète pour SmartMeter.
 * 
 * Fonctionnalités:
 * - Récupération de l'historique au mount (RG18)
 * - Envoi de messages avec contexte MySQL
 * - Typing indicator pendant le chargement
 * - Suggestions de questions au démarrage
 * - Animations Framer Motion
 * - Design cohérent avec le dashboard
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { residentApi } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatResponse {
  id: number;
  question: string;
  reponse: string;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'Quelle est ma consommation moyenne?',
  'Pourquoi ma facture a augmenté?',
  'Comment économiser l\'énergie?',
  'Quels appareils consomment le plus?',
];

export default function ChatInterface() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Récupérer l'historique au montage (RG18)
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!token) return;

        const { data, error } = await residentApi.getChatHistory(token);

        if (error || !data) {
          console.warn('Erreur lors du chargement de l\'historique:', error);
          return;
        }

        // Transformer en Messages alternées
        // Data est ordonné du plus récent au plus ancien
        const transformedMessages: Message[] = [];
        // On traite du plus ancien au plus récent pour l'affichage
        [...data].reverse().forEach((conv: any) => {
          transformedMessages.push({
            id: `user-${conv.id}`,
            role: 'user',
            content: conv.question,
            timestamp: new Date(conv.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
          transformedMessages.push({
            id: `assistant-${conv.id}`,
            role: 'assistant',
            content: conv.reponse,
            timestamp: new Date(conv.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        });

        setMessages(transformedMessages);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error);
      }
    };

    if (token) {
      fetchHistory();
    }
  }, [token]);

  // Scroll vers le bas quand nouveaux messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (question: string) => {
    if (!question.trim() || !token) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await residentApi.sendChatMessage(token, question);

      if (error || !data) {
        throw new Error(error || 'Erreur inconnue');
      }

      const assistantMessage: Message = {
        id: `assistant-${data.id}`,
        role: 'assistant',
        content: data.reponse,
        timestamp: new Date(data.timestamp).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la réponse: ' + (error instanceof Error ? error.message : 'Erreur serveur'));
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      sendMessage(input.trim());
    }
  };

  const handleSendKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage(input.trim());
      }
    }
  };

  // État vide avec suggestions
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 md:p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/10 flex items-center justify-center mb-6 border border-accent-cyan/30"
        >
          <Bot className="w-10 h-10 md:w-12 md:h-12 text-accent-cyan" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-4xl font-bold text-white mb-2 text-center"
        >
          Assistant Énergétique IA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 text-center mb-8 max-w-md"
        >
          Posez des questions sur votre consommation électrique et recevez des recommandations personnalisées.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl"
        >
          {SUGGESTED_QUESTIONS.map((question, index) => (
            <button
              key={index}
              onClick={() => sendMessage(question)}
              className="p-4 rounded-lg bg-surface-raised hover:bg-surface-raised/80 border border-surface-border hover:border-accent-cyan/50 text-left transition-all group"
            >
              <p className="text-sm text-slate-300 group-hover:text-accent-cyan transition-colors">
                {question}
              </p>
            </button>
          ))}
        </motion.div>
      </div>
    );
  }

  // Affichage des messages
  return (
    <div className="flex flex-col h-full">
      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex gap-3 max-w-xs md:max-w-md ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-accent-cyan/20 border border-accent-cyan/30'
                      : 'bg-surface-raised border border-surface-border'
                  }`}
                >
                  {message.role === 'user' ? (
                    <span className="text-xs font-bold text-accent-cyan">U</span>
                  ) : (
                    <MessageCircle className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                {/* Bulle */}
                <div className="flex flex-col gap-1">
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-accent-cyan/10 border border-accent-cyan/20 rounded-tr-sm'
                        : 'bg-surface-raised border border-surface-border rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 px-1">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-raised border border-surface-border flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-slate-400" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-surface-raised border border-surface-border">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
                      style={{
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input fixe en bas */}
      <div className="border-t border-surface-border bg-brand-dark/50 backdrop-blur p-4 md:p-6">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleSendKey}
            placeholder="Posez une question sur votre consommation..."
            rows={1}
            className="flex-1 bg-surface-raised border border-surface-border rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:border-accent-cyan/50 transition-colors"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-3 bg-accent-cyan text-brand-dark rounded-lg font-medium hover:bg-accent-cyan/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden md:inline">Envoyer</span>
          </button>
        </form>
      </div>
    </div>
  );
}
