import { useState, useEffect, FormEvent } from 'react';
import { SAMEntity } from '../types';

interface UseSAMSearchProps {
  apiKey: string | null;
}

export default function useSAMSearch({ apiKey }: UseSAMSearchProps) {
  const [entities, setEntities] = useState<SAMEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<SAMEntity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Search filter vectors
  const [searchUei, setSearchUei] = useState('');
  const [searchName, setSearchName] = useState('');
  const [selectState, setSelectState] = useState('');
  const [searchZip, setSearchZip] = useState('');
  const [selectStatus, setSelectStatus] = useState('All');
  const [exclusionFilter, setExclusionFilter] = useState<'All' | 'Exclusions' | 'Clear'>('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);
  
  const PAGE_LIMIT = 5;

  const handleClearFilters = () => {
    setSearchUei('');
    setSearchName('');
    setSelectState('');
    setSearchZip('');
    setSelectStatus('All');
    setExclusionFilter('All');
    setCurrentPage(0);
  };

  async function executeQuery() {
    setLoading(true);
    setError(null);
    try {
      const qParams = new URLSearchParams();
      if (searchUei) qParams.append('uei', searchUei.trim());
      if (searchName) qParams.append('name', searchName.trim());
      if (selectState) qParams.append('state', selectState);
      if (searchZip) qParams.append('zip', searchZip.trim());
      if (selectStatus !== 'All') qParams.append('status', selectStatus);
      
      if (exclusionFilter === 'Exclusions') {
        qParams.append('exclusion', 'true');
      } else if (exclusionFilter === 'Clear') {
        qParams.append('exclusion', 'false');
      }

      qParams.append('page', currentPage.toString());
      qParams.append('limit', PAGE_LIMIT.toString());

      const fetchHeaders: Record<string, string> = {
        'Accept': 'application/json'
      };
      
      if (apiKey) {
        fetchHeaders['x-sam-gov-api-key'] = apiKey;
      }

      const res = await fetch(`/api/sam/entities?${qParams.toString()}`, {
        headers: fetchHeaders
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || 'Failed to search SAM.gov API');
      }

      const data = await res.json();
      setEntities(data.entities || []);
      setTotalRecords(data.totalRecords || 0);
      
      // Auto-select first item if list updates and no selection exists or outdated selection
      if (data.entities && data.entities.length > 0) {
        const stillInList = data.entities.find((e: SAMEntity) => e.ueiSAM === selectedEntity?.ueiSAM);
        if (!stillInList) {
          setSelectedEntity(data.entities[0]);
        }
      } else {
        setSelectedEntity(null);
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setError(err?.message || 'A network error occurred contacting the proxy API server');
      setEntities([]);
      setTotalRecords(0);
      setSelectedEntity(null);
    } finally {
      setLoading(false);
    }
  }

  // Reload lists when active parameters change, or pages click
  useEffect(() => {
    if (hasSearched) {
      executeQuery();
    }
  }, [
    currentPage, 
    selectStatus, 
    exclusionFilter, 
    apiKey, 
    statsRefreshTrigger
  ]);

  // Handle manual submit search
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setCurrentPage(0);
    executeQuery();
    setStatsRefreshTrigger(prev => prev + 1);
  };

  return {
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
    statsRefreshTrigger,
    setStatsRefreshTrigger,
    executeQuery
  };
}
