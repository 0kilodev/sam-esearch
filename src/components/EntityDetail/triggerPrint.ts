export function triggerPrint(setShowIframeWarning: (val: boolean) => void) {
  // Check if inside iframe
  const isIframe = window.self !== window.top;

  if (isIframe) {
    setShowIframeWarning(true);
  } else {
    try {
      window.print();
    } catch (e) {
      console.error('Window print execution was blocked or failed:', e);
      setShowIframeWarning(true);
    }
  }
}
