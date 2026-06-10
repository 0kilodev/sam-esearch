import React, { useState, useEffect } from 'react';
import { SAMEntity } from '../../types';
import { 
  Building2, MapPin, Calendar, AlertTriangle, 
  CheckCircle2, ShieldX, Copy, Check, Info, FileText, Printer, RefreshCcw
} from 'lucide-react';
import useEntityDetail, { TabType } from '../../hooks/useEntityDetail';

interface EntityDetailProps {
  entity: SAMEntity;
  apiKey: string | null;
  onClose: () => void;
}

export default function EntityDetail({ entity: initialEntity, apiKey, onClose }: EntityDetailProps) {
  const [completeEntity, setCompleteEntity] = useState<SAMEntity | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const { 
    activeTab, 
    setActiveTab, 
    copied, 
    copyUei, 
    showIframeWarning, 
    setShowIframeWarning, 
    printReport 
  } = useEntityDetail({
    ueiSAM: initialEntity.ueiSAM
  });

  useEffect(() => {
    let active = true;
    if (!initialEntity.ueiSAM) return;

    setLoadingDetails(true);
    setDetailsError(null);
    setCompleteEntity(null);

    const headers: Record<string, string> = {
      'Accept': 'application/json'
    };
    if (apiKey) {
      headers['x-sam-gov-api-key'] = apiKey;
    }

    // Attempt to load full registry sections for deep analysis detailed tabs.
    fetch(`/api/sam/entities?uei=${initialEntity.ueiSAM}&includeSections=entityRegistration,coreData,assertions,repsAndCerts`, {
      headers
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('GSA API status error');
        }
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        const found = data.entities?.[0];
        if (found) {
          setCompleteEntity(found);
        } else {
          // If all sections failed (likely because entity is ID Assigned only), fall back to basic info.
          return fetch(`/api/sam/entities?uei=${initialEntity.ueiSAM}&includeSections=entityRegistration,coreData`, { headers })
            .then(res => res.json())
            .then(fallbackData => {
              if (!active) return;
              const lvl2Found = fallbackData.entities?.[0];
              if (lvl2Found) {
                setCompleteEntity(lvl2Found);
              } else {
                setCompleteEntity(initialEntity);
              }
            });
        }
      })
      .catch((err) => {
        if (!active) return;
        console.warn('Full section analysis query bypassed (using list entity):', err);
        setCompleteEntity(initialEntity);
      })
      .finally(() => {
        if (active) {
          setLoadingDetails(false);
        }
      });

    return () => {
      active = false;
    };
  }, [initialEntity.ueiSAM, apiKey]);

  // Shadow 'entity' to automatically route all existing JSX paths to parsed, deep profiles or light fallback.
  const entity = completeEntity || initialEntity;

  const statusColors = {
    Active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Inactive: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
    Expired: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    'ID Assigned': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
  };

  const activeColors = statusColors[entity.status] || statusColors.Active;

  return (
    <div id="entity_detail_container" className="bg-white rounded border border-slate-200 shadow-none overflow-hidden h-full flex flex-col">
      {/* 1. Header Banner */}
      <div className="p-6 bg-white border-b border-slate-200 relative">
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <button 
            onClick={printReport} 
            className="text-slate-700 hover:text-slate-950 transition-colors cursor-pointer text-xs font-bold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-center rounded flex items-center"
            title="Download PDF or Print Report"
          >
            <Printer className="w-3.5 h-3.5 mr-1 text-slate-500" />
            <span>Print PDF</span>
          </button>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer text-xs font-semibold bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-center rounded border border-transparent hover:border-slate-200"
          >
            ✕ Close
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${entity.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-150 text-slate-700'}`}>
            {entity.status}
          </span>
          {entity.exclusionDetails?.hasExclusion && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center space-x-1 uppercase animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              <span>Exclusions Registered</span>
            </span>
          )}
        </div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 pr-16 line-clamp-2">
          {entity.legalBusinessName}
        </h2>
        {entity.dbaName && (
          <p className="text-xs text-slate-500 italic mt-1 mb-2">
            DBA: {entity.dbaName}
          </p>
        )}

        {/* UEI & DUNS indicators row */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded text-xs font-mono">
            <span className="text-slate-500 font-sans font-medium text-[10px] uppercase tracking-wider">UEI:</span>
            <span className="text-slate-800 font-bold select-all">{entity.ueiSAM}</span>
            <button 
              onClick={copyUei} 
              className="text-slate-400 hover:text-slate-850 transition-colors cursor-pointer p-0.5 rounded hover:bg-slate-200"
              title="Copy UEI"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          {entity.duns && (
            <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded text-xs font-mono">
              <span className="text-slate-500 font-sans font-medium text-[10px] uppercase tracking-wider">DUNS:</span>
              <span className="text-slate-800">{entity.duns}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Sub Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 px-2 justify-between items-center pr-4">
        <div className="flex">
          {(['overview', 'naics', 'provisions', 'exclusions'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'border-slate-800 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
              }`}
            >
              {tab === 'naics' ? 'NAICS / PSC' : tab === 'provisions' ? 'Reps & Certs' : tab}
            </button>
          ))}
        </div>
        {loadingDetails && (
          <div className="flex items-center text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wide animate-pulse">
            <RefreshCcw className="w-3 h-3 mr-1 animate-spin text-slate-500" />
            <span>Analyzing Sections...</span>
          </div>
        )}
      </div>

      {/* 3. Detailed Sheets Wrapper */}
      <div className="p-6 flex-1 overflow-y-auto min-h-0 bg-white">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Core Registry Metrics */}
            <div>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Registration Chronology</span>
              </h3>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded border border-slate-200 text-center">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Initial Registered</p>
                  <p className="text-xs font-bold font-mono text-slate-800 mt-1">{entity.registrationDate || 'N/A'}</p>
                </div>
                <div className="border-x border-slate-200">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Activation Date</p>
                  <p className="text-xs font-bold font-mono text-slate-800 mt-1">{entity.activationDate || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Expiration Target</p>
                  <p className="text-xs font-bold font-mono text-slate-900 mt-1">{entity.expirationDate || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Entity Types / structure */}
            {entity.coreData?.entityInformation && (
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Structure Classification</span>
                </h3>
                <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-slate-500">Business Structure:</span>
                    <span className="text-xs font-semibold text-slate-850 text-right">
                      {entity.coreData.entityInformation.organizationStructureDesc || 'Corporate Entity'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                    <span className="text-xs text-slate-500">Industry Sector Code:</span>
                    <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {entity.coreData.entityInformation.entityTypeCode || 'F'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                    <span className="text-xs text-slate-500">Sector Description:</span>
                    <span className="text-xs font-bold text-slate-900">
                      {entity.coreData.entityInformation.entityTypeDesc || 'Business Organization'}
                    </span>
                  </div>
                  {entity.coreData.entityInformation.congressionalDistrict && (
                    <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                      <span className="text-xs text-slate-500">Congressional District:</span>
                      <span className="text-xs font-mono font-bold text-slate-850">
                        {entity.coreData.entityInformation.congressionalDistrict}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location (Addresses) */}
            {entity.coreData?.physicalAddress && (
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Physical Address Details</span>
                </h3>
                <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-4">
                  <div>
                    <h5 className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider mb-1">Corporate Physical</h5>
                    <p className="text-xs text-slate-850 font-bold">{entity.coreData.physicalAddress.addressLine1}</p>
                    {entity.coreData.physicalAddress.addressLine2 && (
                      <p className="text-xs text-slate-850 font-bold">{entity.coreData.physicalAddress.addressLine2}</p>
                    )}
                    <p className="text-xs text-slate-600 mt-0.5">
                      {entity.coreData.physicalAddress.city}, {entity.coreData.physicalAddress.stateOrProvinceCode} {entity.coreData.physicalAddress.zipCode}
                    </p>
                    <p className="text-[9px] font-mono text-slate-400 mt-1">{entity.coreData.physicalAddress.countryCode}</p>
                  </div>

                  {entity.coreData.mailingAddress && (
                    <div className="border-t border-slate-200 pt-3">
                      <h5 className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider mb-1">Mailing Address</h5>
                      <p className="text-xs text-slate-850">{entity.coreData.mailingAddress.addressLine1}</p>
                      <p className="text-xs text-slate-600">
                        {entity.coreData.mailingAddress.city}, {entity.coreData.mailingAddress.stateOrProvinceCode} {entity.coreData.mailingAddress.zipCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Categorizations tags */}
            {entity.coreData?.businessTypes && entity.coreData.businessTypes.businessTypeDescriptions.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 pb-1 border-b border-slate-100">Designations / SBA Flags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {entity.coreData.businessTypes.businessTypeDescriptions.map((desc, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center text-xs bg-slate-100 text-slate-850 font-semibold px-2.5 py-1 rounded border border-slate-200/50"
                    >
                      {desc}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: NAICS / PSC CODES */}
        {activeTab === 'naics' && (
          <div className="space-y-6">
            
            {/* Primary NAICS segment */}
            {entity.assertions?.naicsCodes && entity.assertions.naicsCodes.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100">NAICS Industry Classifications</h3>
                <div className="space-y-3">
                  {entity.assertions.naicsCodes.map((c) => (
                    <div 
                      key={c.naicsCode} 
                      className={`p-4 rounded border ${c.primary ? 'border-slate-300 bg-slate-50/50 border-l-4 border-l-blue-600' : 'border-slate-200 bg-white'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {c.naicsCode}
                          </span>
                          {c.primary && (
                            <span className="text-[9px] bg-slate-800 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                              Primary Industry
                            </span>
                          )}
                        </div>
                        {c.isSmallBusiness !== undefined && (
                          <span className={`text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${c.isSmallBusiness ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-650'}`}>
                            {c.isSmallBusiness ? 'SBA Small' : 'Large Business'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-700 font-bold leading-relaxed">
                        {c.naicsDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Product Service Codes (PSC) */}
            {entity.assertions?.pscCodes && entity.assertions.pscCodes.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100">Product Service Codes (PSC)</h3>
                <div className="grid grid-cols-1 gap-2">
                  {entity.assertions.pscCodes.map((p) => (
                    <div key={p.pscCode} className="flex p-3 bg-slate-50 border border-slate-250/60 rounded items-start space-x-3">
                      <span className="font-mono text-xs font-bold bg-dense bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                        {p.pscCode}
                      </span>
                      <p className="text-xs text-slate-700 font-semibold mt-0.5">
                        {p.pscDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: REPS & PROVISIONS */}
        {activeTab === 'provisions' && (
          <div className="space-y-6">
            
            {/* Reps status */}
            <div className={`p-4 rounded border flex items-start space-x-3 ${entity.repAndCerts?.hasRepsAndCerts ? 'bg-slate-50 border-slate-300 text-slate-900 border-l-4 border-l-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              <FileText className="w-5 h-5 text-slate-600 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">Annual representations & certifications</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {entity.repAndCerts?.hasRepsAndCerts 
                    ? "Entity holds active representations and certifications on file and complies with standard procurement rules. Sub-clauses of Federal Acquisition Regulation (FAR) response profiles are provided below."
                    : "This entity registry profile does not contain representations and certifications response vectors. The entity may be restricted from bidding directly on complex federal prime contract solicitations."}
                </p>
              </div>
            </div>

            {/* provisions breakdown list */}
            {entity.repAndCerts?.provisions && entity.repAndCerts.provisions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">Acquisition Provisions Compliance Details</h3>
                {entity.repAndCerts.provisions.map((prov) => (
                  <div key={prov.provisionId} className="border border-slate-200 rounded p-4 bg-white hover:border-slate-400 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                        FAR {prov.provisionId}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-850 mb-1 leading-relaxed">
                      {prov.title}
                    </h4>
                    {prov.description && (
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                        {prov.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded border border-slate-200">
                      <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-700">{prov.selectedResponse}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 4: EXCLUSIONS */}
        {activeTab === 'exclusions' && (
          <div className="h-full">
            {entity.exclusionDetails?.hasExclusion ? (
              <div className="bg-red-50/50 border border-red-200 p-5 rounded space-y-4">
                
                <div className="flex items-start space-x-3 text-red-900">
                  <ShieldX className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-red-950 uppercase tracking-widest">ACTIVE FEDERAL EXCLUSION RECORDED</h4>
                    <span className="text-[9px] bg-red-150 text-red-950 font-bold px-2 py-0.5 rounded mt-1.5 inline-block uppercase tracking-wider">
                      Action level: RED FLAG / RESTRICTED AWARDS
                    </span>
                  </div>
                </div>

                <div className="border-t border-red-200 pt-4 space-y-3">
                  <div>
                    <h5 className="text-[9px] font-bold text-red-700 uppercase tracking-wider">Exclusion Designation</h5>
                    <p className="text-xs font-semibold font-mono text-slate-900 mt-0.5">{entity.exclusionDetails.exclusionType || 'Procurement Debarment'}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold text-red-700 uppercase tracking-wider">Effective Active Date</h5>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5">{entity.exclusionDetails.activeDate || 'Not specified'}</p>
                  </div>
                  <div>
                    <h5 className="text-[9px] font-bold text-red-700 uppercase tracking-wider">Debarment Authority</h5>
                    <p className="text-xs font-semibold text-slate-900 mt-0.5">{entity.exclusionDetails.authority || 'U.S. Federal Government agency'}</p>
                  </div>
                  <div className="bg-white p-3 rounded border border-red-200">
                    <h5 className="text-[9px] font-bold text-red-700 uppercase tracking-wider">Administrative Reasons Statement</h5>
                    <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                      {entity.exclusionDetails.reason || 'No statement record entered.'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 p-6 rounded flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-3 bg-slate-100 rounded text-slate-850">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">No Active Exclusions Found</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                    This entity has completed a debarment, suspensions, and exclusion search. There are no active exclusion records matches in SAM.gov.
                  </p>
                </div>
                <div className="text-[10px] bg-slate-200 text-slate-800 font-bold border border-slate-300 px-3 py-1 inline-block uppercase font-mono tracking-widest">
                  Compliance Check: CLEAN
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Sandbox Print restrictions Alert Overlay */}
      {showIframeWarning && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded border border-slate-200 p-6 max-w-md w-full shadow-lg space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start space-x-3 text-amber-600">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Browser Iframe Printing Blocked
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  You are currently using this app inside a sandboxed preview panel. Web browsers block the <code>print()</code> instruction inside sandboxed frames for security reasons.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-sm text-xs space-y-2 text-slate-700">
              <p className="font-bold text-slate-800">To print or save the PDF dossier:</p>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                <li>Click the <span className="font-bold">"Open in New Tab"</span> arrow box icon located in the upper-right corner of the preview area.</li>
                <li>In the new stand-alone browser tab, clicking <span className="font-bold">"Print PDF"</span> will open your system's printer window instantly to print or save as PDF!</li>
              </ol>
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowIframeWarning(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 transition-all cursor-pointer"
              >
                Go Back
              </button>
              <a
                href={window.location.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowIframeWarning(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-850 rounded transition-all cursor-pointer inline-flex items-center"
              >
                Launch in New Tab
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
