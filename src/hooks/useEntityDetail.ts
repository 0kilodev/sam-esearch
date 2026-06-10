import { useState } from 'react';
import { handleCopyUei } from '../components/EntityDetail/copyUei';
import { triggerPrint } from '../components/EntityDetail/triggerPrint';

export type TabType = 'overview' | 'naics' | 'provisions' | 'exclusions';

interface UseEntityDetailProps {
  ueiSAM: string;
}

export default function useEntityDetail({ ueiSAM }: UseEntityDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copied, setCopied] = useState(false);
  const [showIframeWarning, setShowIframeWarning] = useState(false);

  const copyUei = () => {
    handleCopyUei(ueiSAM, setCopied);
  };

  const printReport = () => {
    triggerPrint(setShowIframeWarning);
  };

  return {
    activeTab,
    setActiveTab,
    copied,
    copyUei,
    showIframeWarning,
    setShowIframeWarning,
    printReport
  };
}
