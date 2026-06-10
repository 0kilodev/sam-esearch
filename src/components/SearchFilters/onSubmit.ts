import { FormEvent } from 'react';

export function handleFilterSubmit(
  e: FormEvent,
  onSearchSubmit: (e: FormEvent) => void
) {
  e.preventDefault();
  onSearchSubmit(e);
}
