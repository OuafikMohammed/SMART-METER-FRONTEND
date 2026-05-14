import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  error: string | null;
  onRetry?: () => void;
  loading?: boolean;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry, loading = false }) => {
  if (!error) return null;

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
        <span className="text-red-400 text-sm">{error}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          disabled={loading}
          className="px-4 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 text-red-400 rounded border border-red-500/30 transition-colors font-medium whitespace-nowrap"
        >
          {loading ? "Chargement..." : "Réessayer"}
        </button>
      )}
    </div>
  );
};
