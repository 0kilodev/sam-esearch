import React from 'react';
import { 
  Building2, SlidersHorizontal, RefreshCcw, AlertTriangle, 
  ChevronRight, ChevronLeft, Award 
} from 'lucide-react';
import { SAMEntity } from '../../types';

interface ResultsPanelProps {
  hasSearched: boolean;
  loading: boolean;
  error: string | null;
  entities: SAMEntity[];
  totalRecords: number;
  selectedEntity: SAMEntity | null;
  setSelectedEntity: (entity: SAMEntity) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  PAGE_LIMIT: number;
  exclusionFilter: string;
  setExclusionFilter: (val: 'All' | 'Exclusions' | 'Clear') => void;
}

export default function ResultsPanel({
  hasSearched,
  loading,
  error,
  entities,
  totalRecords,
  selectedEntity,
  setSelectedEntity,
  currentPage,
  setCurrentPage,
  PAGE_LIMIT,
  exclusionFilter,
  setExclusionFilter,
}: ResultsPanelProps) {
  
  const statusBadges = (status: string) => {
    switch (status) {
      case 'Active':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Active</span>;
      case 'Expired':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">Expired</span>;
      case 'ID Assigned':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">ID Assigned</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200">Inactive</span>;
    }
  };

  return (
    <div className="bg-white rounded border border-slate-200 p-5 flex-1 flex flex-col min-h-[460px]">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-150">
        <div className="flex items-baseline space-x-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Query Results</h4>
          <span className="text-xs text-slate-500 font-bold font-mono">({totalRecords} registries)</span>
        </div>
        {loading && (
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <RefreshCcw className="w-2.5 h-2.5 animate-spin text-slate-600" />
            <span>Querying real-time records...</span>
          </div>
        )}
      </div>

      {/* Error warning sheets */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-900 text-xs mb-4 flex flex-col">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">GSA Gateway connection unsuccessful</p>
              <p className="mt-1 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Entity search items list */}
      <div className="flex-1 space-y-2.5 min-h-[300px]">
        {!hasSearched ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <SlidersHorizontal className="w-8 h-8 text-slate-300 mb-3 animate-pulse" />
            <p className="font-bold text-sm text-slate-700">Enter query parameters to start searching</p>
            <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
              Configure your free GSA API key via the settings gear icon, specify your filters above, and click the Filter button to retrieve live SAM.gov registrations.
            </p>
          </div>
        ) : !loading && entities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <Building2 className="w-8 h-8 text-slate-350 mb-3" />
            <p className="font-bold text-sm text-slate-700">No agencies or entities match your criteria</p>
            <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
              Try shortening company name keyword searches, reviewing your physical state parameters, or clearing active search filters.
            </p>
            {exclusionFilter !== 'All' && (
              <button 
                onClick={() => setExclusionFilter('All')} 
                className="mt-3 text-xs bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1 rounded font-bold cursor-pointer hover:bg-slate-200"
              >
                Deactivate Exclusions Alert Filter
              </button>
            )}
          </div>
        ) : (
          entities.map((item) => {
            const isSelected = selectedEntity?.ueiSAM === item.ueiSAM;
            const primaryNaics = item.assertions?.naicsCodes.find(n => n.primary === true);
            const hasActiveExcl = item.exclusionDetails?.hasExclusion === true;

            return (
              <div
                key={item.ueiSAM}
                onClick={() => setSelectedEntity(item)}
                className={`p-3.5 rounded border transition-all duration-150 flex items-start justify-between cursor-pointer ${
                  isSelected
                    ? 'border-slate-400 bg-slate-50/70 border-l-4 border-l-slate-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-100/50'
                }`}
              >
                <div className="space-y-1 flex-1 pr-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {statusBadges(item.status)}
                    {hasActiveExcl && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center space-x-1 uppercase">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>Administrative Exclusion</span>
                      </span>
                    )}
                    {item.coreData?.businessTypes.businessTypeDescriptions.some(b => b.toLowerCase().includes('small business')) && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1 uppercase">
                        <Award className="w-2.5 h-2.5" />
                        <span>SBA Small</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-snug">
                    {item.legalBusinessName}
                  </h4>

                  {primaryNaics && (
                    <p className="text-[11px] text-slate-500 font-semibold">
                      Industry: <span className="text-slate-800">{primaryNaics.naicsDescription}</span>
                    </p>
                  )}

                  <div className="flex items-center space-x-1.5 text-[9px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                    <span>UEI SAM: <span className="text-slate-600 font-bold select-all">{item.ueiSAM}</span></span>
                    <span>•</span>
                    <span>{item.coreData?.physicalAddress.city}, {item.coreData?.physicalAddress.stateOrProvinceCode}</span>
                  </div>
                </div>

                <div className="flex items-center self-center text-slate-400 shrink-0">
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'transform translate-x-1 text-slate-900' : ''}`} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PAGINATION PANEL AT BOTTOM */}
      {totalRecords > PAGE_LIMIT && (
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            className={`px-2.5 py-1.5 border border-slate-200 text-[11px] font-bold rounded flex items-center space-x-1 cursor-pointer transition-colors ${
              currentPage === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="text-xs font-bold font-mono text-slate-600">
            {currentPage + 1} / {Math.ceil(totalRecords / PAGE_LIMIT)}
          </span>

          <button
            disabled={currentPage >= Math.ceil(totalRecords / PAGE_LIMIT) - 1}
            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalRecords / PAGE_LIMIT) - 1, prev + 1))}
            className={`px-2.5 py-1.5 border border-slate-200 text-[11px] font-bold rounded flex items-center space-x-1 cursor-pointer transition-colors ${
              currentPage >= Math.ceil(totalRecords / PAGE_LIMIT) - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
}
