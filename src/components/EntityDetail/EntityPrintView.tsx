import { SAMEntity } from '../../types';

interface EntityPrintViewProps {
  entity: SAMEntity | null;
}

export default function EntityPrintView({ entity }: EntityPrintViewProps) {
  if (!entity) return null;

  const currentFormattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div id="sam-gov-print-report-root" className="p-8 font-sans max-w-4xl mx-auto text-black bg-white leading-relaxed">
      {/* 1. ARCHIVAL HEADER */}
      <div className="border-b-4 border-slate-900 pb-5 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[10px] font-mono tracking-widest uppercase font-black text-slate-500">
              U.S. Federal Government Registry Dossier
            </h1>
            <h2 className="text-2xl font-black tracking-tight text-slate-950 mt-1 uppercase">
              SAM.gov Entity Record Sheet
            </h2>
          </div>
          <div className="text-right">
            <span className={`inline-block border px-3 py-1 text-xs font-mono font-bold uppercase ${
              entity.status === 'Active' 
                ? 'border-emerald-600 text-emerald-800 bg-emerald-50' 
                : 'border-slate-400 text-slate-700 bg-slate-50'
            }`}>
              REGISTRATION STATUS: {entity.status}
            </span>
          </div>
        </div>
        
        <p className="text-[10px] text-slate-400 font-mono mt-3">
          Generated via Explorer Portal: {currentFormattedDate} (UTC)
        </p>
      </div>

      {/* 2. SUMMARY CARD */}
      <div className="bg-slate-50 border border-slate-300 p-5 rounded-sm mb-6 grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-black">Legal Business Name</h3>
          <p className="text-lg font-bold text-slate-900">{entity.legalBusinessName}</p>
          {entity.dbaName && (
            <p className="text-xs text-slate-600 mt-0.5 italic">DBA: {entity.dbaName}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 border-b border-slate-200 pb-1.5 text-xs">
            <span className="font-mono text-slate-500 font-bold uppercase text-[9px]">UEI (SAM)</span>
            <span className="font-mono font-bold text-slate-950 text-right">{entity.ueiSAM}</span>
          </div>
          {entity.duns && (
            <div className="grid grid-cols-2 border-b border-slate-200 pb-1.5 text-xs">
              <span className="font-mono text-slate-500 font-bold uppercase text-[9px]">DUNS Number</span>
              <span className="font-mono font-bold text-slate-950 text-right">{entity.duns}</span>
            </div>
          )}
          <div className="grid grid-cols-2 text-xs">
            <span className="font-mono text-slate-500 font-bold uppercase text-[9px]">Exclusions</span>
            <span className="font-mono font-bold text-right text-red-700">
              {entity.exclusionDetails?.hasExclusion ? 'ACTIVE FLAG' : 'NONE DETECTED'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. CORE CHRONOLOGY & CLASSIFICATIONS */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-xs uppercase tracking-wider font-mono font-black text-slate-500 border-b border-slate-350 pb-1 mb-2">
            chronological milestones
          </h4>
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 text-slate-500">Registration Date</td>
                <td className="py-1.5 text-right font-mono font-bold text-slate-800">{entity.registrationDate || 'N/A'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 text-slate-500">Activation Date</td>
                <td className="py-1.5 text-right font-mono font-bold text-slate-800">{entity.activationDate || 'N/A'}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 text-slate-500">Expiration Date</td>
                <td className="py-1.5 text-right font-mono font-bold text-slate-950">{entity.expirationDate || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-mono font-black text-slate-500 border-b border-slate-350 pb-1 mb-2">
            Structure and District
          </h4>
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 text-slate-500">Business Type</td>
                <td className="py-1.5 text-right font-semibold text-slate-800">
                  {entity.coreData?.entityInformation?.organizationStructureDesc || 'Corporate Organization'}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 text-slate-500">Industry Sector Code</td>
                <td className="py-1.5 text-right font-mono font-bold text-slate-800">
                  {entity.coreData?.entityInformation?.entityTypeCode || 'F'}
                </td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="py-1.5 text-slate-500">Congressional District</td>
                <td className="py-1.5 text-right font-mono font-bold text-slate-950">
                  {entity.coreData?.entityInformation?.congressionalDistrict || 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ADDRESS INFORMATION */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-xs uppercase tracking-wider font-mono font-black text-slate-500 border-b border-slate-350 pb-1 mb-2">
            Physical Location
          </h4>
          {entity.coreData?.physicalAddress ? (
            <div className="text-xs">
              <p className="font-bold text-slate-900">{entity.coreData.physicalAddress.addressLine1}</p>
              {entity.coreData.physicalAddress.addressLine2 && (
                <p className="font-bold text-slate-900">{entity.coreData.physicalAddress.addressLine2}</p>
              )}
              <p className="text-slate-700 mt-1">
                {entity.coreData.physicalAddress.city}, {entity.coreData.physicalAddress.stateOrProvinceCode} {entity.coreData.physicalAddress.zipCode}
              </p>
              <p className="font-mono text-slate-500 uppercase text-[9px] mt-1">
                Country: {entity.coreData.physicalAddress.countryCode}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No physical location entered.</p>
          )}
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-mono font-black text-slate-500 border-b border-slate-350 pb-1 mb-2">
            Official Designations
          </h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {entity.coreData?.businessTypes?.businessTypeDescriptions && 
            entity.coreData.businessTypes.businessTypeDescriptions.length > 0 ? (
              entity.coreData.businessTypes.businessTypeDescriptions.map((desc, idx) => (
                <span 
                  key={idx} 
                  className="bg-slate-100 text-slate-900 border border-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-sm"
                >
                  {desc}
                </span>
              ))
            ) : (
              <span className="text-xs italic text-slate-500">Standard Business Registrant</span>
            )}
          </div>
        </div>
      </div>

      {/* 5. NAICS INDUSTRY CODES */}
      <div className="mb-6 print-no-break">
        <h4 className="text-xs uppercase tracking-wider font-mono font-black text-slate-500 border-b border-slate-350 pb-1 mb-3">
          NAICS Industry classifications
        </h4>
        <div className="space-y-2">
          {entity.assertions?.naicsCodes && entity.assertions.naicsCodes.length > 0 ? (
            entity.assertions.naicsCodes.map((c) => (
              <div key={c.naicsCode} className="border border-slate-200 p-3 rounded-sm flex items-start justify-between text-xs bg-slate-50/55">
                <div className="pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-950 bg-slate-200 px-1.5 py-0.5 rounded-sm">
                      {c.naicsCode}
                    </span>
                    {c.primary && (
                      <span className="bg-slate-800 text-white font-mono text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider">
                        Primary Class
                      </span>
                    )}
                    {c.isSmallBusiness !== undefined && (
                      <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider">
                        {c.isSmallBusiness ? 'SBA Small' : 'SBA Large'}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 font-bold text-slate-900">{c.naicsDescription}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No NAICS provisions recorded in this cache index.</p>
          )}
        </div>
      </div>

      {/* 6. PRODUCT SERVICE CODES */}
      {entity.assertions?.pscCodes && entity.assertions.pscCodes.length > 0 && (
        <div className="mb-6 print-no-break">
          <h4 className="text-xs uppercase tracking-wider font-mono font-black text-slate-500 border-b border-slate-350 pb-1 mb-3">
            Product Service Codes (PSC)
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {entity.assertions.pscCodes.map((p) => (
              <div key={p.pscCode} className="border border-slate-200 p-2 rounded-sm flex items-start space-x-2 bg-slate-50/30">
                <span className="font-mono font-bold bg-slate-150 text-slate-800 px-1 py-0.5 rounded-xs">
                  {p.pscCode}
                </span>
                <span className="font-medium text-slate-700">{p.pscDescription}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. COMPLIANCE EXCLUSIONS BLOCK */}
      <div className="mb-6 print-no-break">
        <h4 className="text-xs uppercase tracking-wider font-mono font-black text-slate-500 border-b border-slate-350 pb-1 mb-3">
          Federal Compliance Audit & Exclusions Check
        </h4>
        {entity.exclusionDetails?.hasExclusion ? (
          <div className="border-2 border-red-500 p-4 rounded-sm bg-red-50 text-xs">
            <h5 className="font-bold text-red-950 uppercase tracking-widest flex items-center space-x-1 mb-1">
              ⚠️ WARNING: ACTIVE EXCLUSION RECORD ENCOUNTERED
            </h5>
            <p className="text-slate-800 font-medium">
              This entity currently holds an active restriction, suspension, debarment, or indictment from receiving awards on federal agency contracts.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-red-200 pt-2 font-mono text-[10px]">
              <div>
                <span className="text-red-700 block uppercase font-bold">Exclusion Type</span>
                <span className="text-slate-900 font-bold">{entity.exclusionDetails.exclusionType || 'Procurement debarment'}</span>
              </div>
              <div>
                <span className="text-red-700 block uppercase font-bold">Effective Date</span>
                <span className="text-slate-900 font-bold">{entity.exclusionDetails.activeDate || 'N/A'}</span>
              </div>
              <div className="col-span-2 mt-1">
                <span className="text-red-700 block uppercase font-bold">Authority / Cause Statement</span>
                <span className="text-slate-900 font-bold">{entity.exclusionDetails.reason || 'No specific statement context listed.'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-emerald-500 p-4 rounded-sm bg-emerald-50/50 text-xs flex justify-between items-center">
            <div>
              <h5 className="font-black text-emerald-950 uppercase tracking-wider">No Active Administrative Exclusions</h5>
              <p className="text-slate-600 mt-0.5">The query search did not match any active federal suspensions, debarments, or debarred list criteria.</p>
            </div>
            <span className="border border-emerald-500 text-emerald-800 bg-white font-mono text-[10px] font-bold px-3 py-1 uppercase rounded-xs">
              PROCURABLE STATUS: CLEAN
            </span>
          </div>
        )}
      </div>

      {/* 8. REPS & CERTS - DETAILED BREAKDOWN PROVISIONS */}
      <div className="print-page-break print-no-break">
        <h4 className="text-xs uppercase tracking-wider font-mono font-black text-slate-500 border-b border-slate-350 pb-1 mb-3">
          Annual representations & certifications (FAR provisions compliance)
        </h4>

        {entity.repAndCerts?.provisions && entity.repAndCerts.provisions.length > 0 ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 italic mb-2">
              The recipient maintains active representations and certifications responses mapped below (Federal Acquisition Regulation):
            </p>
            {entity.repAndCerts.provisions.map((prov) => (
              <div key={prov.provisionId} className="border border-slate-200 p-3 rounded-sm text-xs bg-slate-50/20">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-mono font-bold text-slate-900 bg-slate-200 px-1.5 py-0.5 rounded-sm">
                    FAR {prov.provisionId}
                  </span>
                  <span className="font-mono text-[9px] uppercase font-bold text-slate-500">Provision Map</span>
                </div>
                <h5 className="font-bold text-slate-850 mt-1">{prov.title}</h5>
                {prov.description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{prov.description}</p>}
                
                <div className="mt-2.5 bg-slate-100 p-2 border border-slate-250 rounded-xs flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">response:</span>
                  <span className="font-mono font-bold text-slate-800">{prov.selectedResponse}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            This registry does not have active representations and certifications vectors catalogued under FAR requirements.
          </p>
        )}
      </div>

      {/* 9. SIGNATURE VERIFICATION BAR */}
      <div className="mt-12 pt-6 border-t border-slate-350 text-center">
        <div className="inline-block border border-slate-300 bg-slate-50 p-4 text-left max-w-md mx-auto text-xs font-mono">
          <p className="font-bold text-slate-800 text-center uppercase tracking-wider mb-2">System Cryptographic Verification</p>
          <p className="text-slate-500 text-[10px] uppercase leading-tight">
            Registry Source: GSA SAM.gov API Gateway isomorph mapping.<br />
            Security state: Signed-by SAM.gov Explorer Internal Protocol Proxy.<br />
            Report checksum: {entity.ueiSAM || 'HASH_VAL'} - {entity.status || 'N/A'} - {entity.registrationDate || 'N/A'}.
          </p>
        </div>
      </div>
    </div>
  );
}
