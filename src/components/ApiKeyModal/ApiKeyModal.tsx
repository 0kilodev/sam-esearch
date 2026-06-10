import React from 'react';
import { Key, Info, ExternalLink } from 'lucide-react';
import useApiKeyModalForm from '../../hooks/useApiKeyModalForm';

interface ApiKeyModalProps {
  onClose: () => void;
  onKeySaved: (key: string | null) => void;
  currentKey: string | null;
  hasServerKey?: boolean;
}

export default function ApiKeyModal({ onClose, onKeySaved, currentKey, hasServerKey }: ApiKeyModalProps) {
  const { apiKey, setApiKey, onSubmit } = useApiKeyModalForm({
    currentKey,
    onKeySaved,
    onClose
  });

  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded border border-slate-300 shadow-xl max-w-md w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
        
        {/* Modal Header */}
        <div className="p-4 px-5 bg-white border-b border-slate-200 text-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-slate-755" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-slate-900">API Configurations</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-850 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-xs font-bold rounded"
          >
            ✕ Close
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={onSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Enter your free GSA Developer Token Key below to connect live queries directly to the public federal registries on SAM.gov.
          </p>

          {hasServerKey && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] leading-relaxed">
              <span className="font-bold">✓ Default Server Key Active:</span> A standard <code>SAM_GOV_API_KEY</code> is configured on the backend. You may optional specify a custom key below as an override, or clear it to use the server default.
            </div>
          )}

          {/* Key Input */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              GSA SAM.gov API Token Key {hasServerKey && "(Optional Override)"}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={hasServerKey ? "Using default server key..." : "Paste your open.gsa.gov key here..."}
              className="w-full text-xs font-mono px-3 py-2 rounded border border-slate-200 focus:outline-hidden focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:bg-white bg-slate-50"
            />
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start space-x-2">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div className="text-[10px] text-slate-500 leading-relaxed">
                <p className="font-bold text-slate-700">Need a token?</p>
                <p className="mt-0.5">
                  GSA API access is completely free and instant. Obtain your developer API access key in seconds at the self-service registration port:
                </p>
                <a 
                  href="https://open.gsa.gov/api/register/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-blue-600 font-bold hover:underline mt-1"
                >
                  <span>Register on GSA Developer Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 rounded hover:bg-slate-850 transition-colors cursor-pointer"
            >
              Apply Settings
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
