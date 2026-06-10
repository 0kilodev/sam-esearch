export function handleCopyUei(uei: string, setCopied: (val: boolean) => void) {
  navigator.clipboard.writeText(uei);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
}
