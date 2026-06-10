import { Landmark, Settings } from 'lucide-react';

interface HeaderProps {
  apiKey: string | null;
  hasServerKey?: boolean;
  onSettingsClick: () => void;
}

export default function Header({ apiKey, hasServerKey, onSettingsClick }: HeaderProps) {
  const isConfigured = !!apiKey || !!hasServerKey;

  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-slate-900 rounded text-white">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-900 flex items-center space-x-2">
              <span>SAM.gov Explorer</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">GSA Registry Portal</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Mode indicators */}
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 rounded border border-slate-200">
            <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'}`}></span>
            <span className="text-[9px] font-bold font-mono uppercase text-slate-600">
              {apiKey ? 'Custom Local Override' : hasServerKey ? 'Server Environment Key Active' : 'API Key Missing'}
            </span>
          </div>

          <button
            onClick={onSettingsClick}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 rounded cursor-pointer text-slate-600 hover:text-slate-900"
            title="API settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
