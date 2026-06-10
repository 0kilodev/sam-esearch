import React from 'react';
import { SlidersHorizontal, Search, ShieldX } from 'lucide-react';
import { US_STATES } from '../../constants/USStates';
import { handleFilterSubmit } from './onSubmit';

interface SearchFiltersProps {
  searchUei: string;
  setSearchUei: (val: string) => void;
  searchName: string;
  setSearchName: (val: string) => void;
  selectState: string;
  setSelectState: (val: string) => void;
  searchZip: string;
  setSearchZip: (val: string) => void;
  selectStatus: string;
  setSelectStatus: (val: string) => void;
  exclusionFilter: string;
  setExclusionFilter: (val: 'All' | 'Exclusions' | 'Clear') => void;
  onClearFilters: () => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export default function SearchFilters({
  searchUei,
  setSearchUei,
  searchName,
  setSearchName,
  selectState,
  setSelectState,
  searchZip,
  setSearchZip,
  selectStatus,
  setSelectStatus,
  exclusionFilter,
  setExclusionFilter,
  onClearFilters,
  onSearchSubmit
}: SearchFiltersProps) {
  return (
    <div className="bg-white rounded border border-slate-200 p-5">
      <div className="flex items-center space-x-2 mb-4">
        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-750" />
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Explorer Query Parameters</h3>
      </div>
      
      <form onSubmit={(e) => handleFilterSubmit(e, onSearchSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* UEI or DUNS */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Unique Entity ID (UEI) / DUNS</label>
            <div className="relative">
              <input
                type="text"
                value={searchUei}
                onChange={(e) => setSearchUei(e.target.value)}
                placeholder="e.g. LMT779ABC012"
                className="w-full text-xs font-mono px-3 py-2 rounded border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:bg-white"
              />
            </div>
          </div>

          {/* Registered Company Legal Name */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Company Legal Business Name</label>
            <div className="relative">
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g. Lockheed Martin"
                className="w-full text-xs px-3 py-2 rounded border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* State Select dropdown */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Physical Address State</label>
            <select
              value={selectState}
              onChange={(e) => setSelectState(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:bg-white cursor-pointer font-medium"
            >
              {US_STATES.map((st) => (
                <option key={st.code} value={st.code}>{st.name}</option>
              ))}
            </select>
          </div>

          {/* Zip Code Filter */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">ZIP Code</label>
            <input
              type="text"
              maxLength={5}
              value={searchZip}
              onChange={(e) => setSearchZip(e.target.value)}
              placeholder="e.g. 20817"
              className="w-full text-xs px-3 py-2 rounded border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:bg-white font-mono"
            />
          </div>

          {/* Status Selection */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Active Status</label>
            <select
              value={selectStatus}
              onChange={(e) => setSelectStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-slate-800 focus:ring-1 focus:ring-slate-800 focus:bg-white cursor-pointer font-medium"
            >
              <option value="All">All Registrations</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
              <option value="Expired">Expired Profiles</option>
              <option value="ID Assigned">ID Assigned (No Contracts)</option>
            </select>
          </div>
        </div>

        {/* Exclusions Quick Filter Segment */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <ShieldX className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-600 font-bold block">Compliance Filter:</span>
            <div className="inline-flex rounded bg-slate-100 p-0.5 border border-slate-200 text-[10px]">
              {(['All', 'Exclusions', 'Clear'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setExclusionFilter(opt)}
                  className={`px-3 py-1 rounded font-bold transition-all cursor-pointer ${
                    exclusionFilter === opt
                      ? 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-850'
                  }`}
                >
                  {opt === 'All' ? 'All' : opt === 'Exclusions' ? 'Flagged' : 'Clean Only'}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Action triggers */}
          <div className="flex items-center space-x-2 self-end">
            <button
              type="button"
              onClick={onClearFilters}
              className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded flex items-center space-x-1.5 cursor-pointer"
            >
              <Search className="w-3 h-3" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
