import React, { useState } from 'react';
import { Info, SlidersHorizontal } from 'lucide-react';
import EntityDetail from './components/EntityDetail';
import ApiKeyModal from './components/ApiKeyModal';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchFilters from './components/SearchFilters';
import ResultsPanel from './components/ResultsPanel';
import EntityPrintView from './components/EntityDetail/EntityPrintView';

// Hooks
import useApiKey from './hooks/useApiKey';
import useSAMSearch from './hooks/useSAMSearch';

export default function App() {
  // Load and save GSA standard API Key from hook
  const { apiKey, saveApiKey } = useApiKey();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasServerKey, setHasServerKey] = useState(false);

  // Check if server already has a default SAM_GOV_API_KEY env key configured
  React.useEffect(() => {
    fetch('/api/sam/config')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.hasServerKey === 'boolean') {
          setHasServerKey(data.hasServerKey);
        }
      })
      .catch(err => console.error('Failed to retrieve server API configuration status:', err));
  }, []);

  // Load state and functions from consolidated search hook
  const {
    entities,
    loading,
    totalRecords,
    selectedEntity,
    setSelectedEntity,
    error,
    hasSearched,
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
    currentPage,
    setCurrentPage,
    PAGE_LIMIT,
    handleClearFilters,
    handleSearchSubmit,
    setStatsRefreshTrigger
  } = useSAMSearch({ apiKey });

  const handleKeySaved = (key: string | null) => {
    saveApiKey(key);
    setCurrentPage(0);
    setStatsRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-850">
        {/* Top Navigation / Header */}
        <Header apiKey={apiKey} hasServerKey={hasServerKey} onSettingsClick={() => setShowApiKeyModal(true)} />

        {/* Main Core Content Container */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 flex flex-col min-h-0">
          
          {/* Banner Alert if API Key is missing completely */}
          {!apiKey && !hasServerKey && (
            <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded mb-5 flex items-start space-x-3 text-slate-700">
              <Info className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed text-slate-700">
                <span className="font-bold text-slate-900">GSA SAM.gov API Gateway Configuration Required:</span> Paste your free GSA Developer Token Key into the settings panel (accessible via the <span className="font-bold">gear icon</span> in the upper-right corner) to interact with live registrations from the federal database.
              </div>
            </div>
          )}

          {/* Search Split Side-by-side Sheet Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1 min-h-0">
            
            {/* Main Controls + Results List (Col span 7) */}
            <div className="lg:col-span-7 space-y-5 flex flex-col">
              
              <SearchFilters
                searchUei={searchUei}
                setSearchUei={setSearchUei}
                searchName={searchName}
                setSearchName={setSearchName}
                selectState={selectState}
                setSelectState={setSelectState}
                searchZip={searchZip}
                setSearchZip={setSearchZip}
                selectStatus={selectStatus}
                setSelectStatus={setSelectStatus}
                exclusionFilter={exclusionFilter}
                setExclusionFilter={setExclusionFilter}
                onClearFilters={handleClearFilters}
                onSearchSubmit={handleSearchSubmit}
              />

              <ResultsPanel
                hasSearched={hasSearched}
                loading={loading}
                error={error}
                entities={entities}
                totalRecords={totalRecords}
                selectedEntity={selectedEntity}
                setSelectedEntity={setSelectedEntity}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                PAGE_LIMIT={PAGE_LIMIT}
                exclusionFilter={exclusionFilter}
                setExclusionFilter={setExclusionFilter}
              />

            </div>

            {/* INSPECTOR VIEW DEEP VIEW SHEET (Col span 5) */}
            <div className="lg:col-span-5 h-[640px] lg:h-[720px] sticky lg:top-20">
              {selectedEntity ? (
                <EntityDetail 
                  entity={selectedEntity} 
                  onClose={() => setSelectedEntity(null)} 
                />
              ) : (
                <div className="bg-slate-50 rounded border border-dashed border-slate-300 p-8 h-full flex flex-col items-center justify-center text-center">
                  <div className="p-3 bg-slate-100 text-slate-400 rounded mb-3">
                    <SlidersHorizontal className="w-6 h-6" />
                  </div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Entity Inspector</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-2 leading-relaxed">
                    Select a business registration item from the list to analyze detailed physically valid addresses, primary NAICS, PSC categories, FAR contract clauses, and active exclusions.
                  </p>
                </div>
              )}
            </div>

          </div>
        </main>

        {/* Optional api key settings modal */}
        {showApiKeyModal && (
          <ApiKeyModal
            currentKey={apiKey}
            hasServerKey={hasServerKey}
            onClose={() => setShowApiKeyModal(false)}
            onKeySaved={handleKeySaved}
          />
        )}

        <Footer />
      </div>

      {selectedEntity && (
        <EntityPrintView entity={selectedEntity} />
      )}
    </>
  );
}
