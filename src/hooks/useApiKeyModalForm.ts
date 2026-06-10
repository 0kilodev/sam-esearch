import { useState, FormEvent } from 'react';
import { handleApiKeySubmit } from '../components/ApiKeyModal/handleSubmit';

interface UseApiKeyModalFormProps {
  currentKey: string | null;
  onKeySaved: (key: string | null) => void;
  onClose: () => void;
}

export default function useApiKeyModalForm({ currentKey, onKeySaved, onClose }: UseApiKeyModalFormProps) {
  const [apiKey, setApiKey] = useState(currentKey || '');

  const onSubmit = (e: FormEvent) => {
    handleApiKeySubmit(e, apiKey, onKeySaved, onClose);
  };

  return {
    apiKey,
    setApiKey,
    onSubmit
  };
}
