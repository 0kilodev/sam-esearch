import { FormEvent } from 'react';

export function handleApiKeySubmit(
  e: FormEvent,
  apiKey: string,
  onKeySaved: (key: string | null) => void,
  onClose: () => void
) {
  e.preventDefault();
  if (apiKey.trim()) {
    onKeySaved(apiKey.trim());
  } else {
    onKeySaved(null);
  }
  onClose();
}
