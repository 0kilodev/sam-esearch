import { useState } from 'react';

export default function useApiKey() {
  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('sam_gov_api_token'));

  const saveApiKey = (key: string | null) => {
    if (key) {
      localStorage.setItem('sam_gov_api_token', key);
      setApiKey(key);
    } else {
      localStorage.removeItem('sam_gov_api_token');
      setApiKey(null);
    }
  };

  return {
    apiKey,
    saveApiKey
  };
}
