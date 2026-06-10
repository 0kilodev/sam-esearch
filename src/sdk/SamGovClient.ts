import { SAMEntity, SAMQueryResponse } from "../types";

export interface SamGovClientOptions {
  /**
   * Your GSA SAM.gov standard developer token key.
   * If not provided, it falls back to the process.env.SAM_GOV_API_KEY environment variable.
   */
  apiKey?: string;
  /**
   * Base URL of the SAM.gov entity-information API (v3 interface).
   * Defaults to 'https://api.sam.gov/entity-information/v3'
   */
  baseUrl?: string;
}

export interface SamGovSearchOptions {
  /**
   * Unique Entity Identifier (UEI) on SAM.gov
   */
  uei?: string;
  /**
   * Legal business name of the registered entity
   */
  name?: string;
  /**
   * State code (e.g., 'VA', 'CA', 'TX')
   */
  state?: string;
  /**
   * Postal Zip code of the physical address
   */
  zip?: string;
  /**
   * Optional status: 'Active', 'Expired', 'Inactive', 'ID Assigned', or 'All'
   */
  status?: string;
  /**
   * Optional includeSections: comma-separated list of GSA sections to retrieve (e.g., 'entityRegistration,coreData')
   */
  includeSections?: string;
  /**
   * The page offset to return (0-indexed)
   */
  page?: number | string;
  /**
   * Max records per page query
   */
  limit?: number | string;
}

export class SamGovClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(options: SamGovClientOptions = {}) {
    this.apiKey = options.apiKey || process.env.SAM_GOV_API_KEY || "";
    this.baseUrl = options.baseUrl || "https://api.sam.gov/entity-information/v3";
  }

  /**
   * Get federal registration records filtered by UEI, name, state, and zip.
   */
  public async getEntities(options: SamGovSearchOptions = {}): Promise<SAMQueryResponse> {
    if (!this.apiKey) {
      throw new Error(
        "SAM.gov Explorer API token is missing. Please provide a key in client options or set the SAM_GOV_API_KEY environment variable."
      );
    }

    const gsaParams = new URLSearchParams();
    gsaParams.append("api_key", this.apiKey);

    // Default to 'entityRegistration,coreData' to include entities with limited registrations (like ID Assigned).
    // If we request assertions or repsAndCerts, unregistered/ID Assigned ones are filtered out by the GSA REST rules.
    const statusVal = options.status || "All";
    let isRegistered = "ALL";
    if (statusVal === "ID Assigned") {
      isRegistered = "N";
    } else if (statusVal === "Active" || statusVal === "Inactive" || statusVal === "Expired") {
      isRegistered = "Y";
    }

    gsaParams.append("isRegistered", isRegistered);

    // Default includeSections based on isRegistered parameter.
    // If we request isRegistered=N or ALL, requesting 'coreData' can prompt GSA
    // to filter out unregistered (ID Assigned) entities entirely.
    // Therefore, we use only 'entityRegistration' for unregistered entities.
    const defaultSections = isRegistered === "Y" ? "entityRegistration,coreData" : "entityRegistration";
    const includeSections = options.includeSections || defaultSections;
    gsaParams.append("includeSections", includeSections);

    if (options.uei) {
      gsaParams.append("ueiSAM", options.uei.trim().toUpperCase());
    }
    if (options.name) {
      gsaParams.append("legalBusinessName", options.name.trim());
    }
    if (options.state) {
      gsaParams.append("state", options.state.trim().toUpperCase());
    }
    if (options.zip) {
      gsaParams.append("zipCode", options.zip.trim());
    }

    // Configure registrationStatus queries
    // Only pass registrationStatus parameter when filtering for registered status types.
    // Doing so prevents GSA from filtering out unregistered (ID Assigned) entities.
    if (isRegistered === "Y" && options.status && options.status !== "All") {
      gsaParams.append("registrationStatus", options.status);
    }

    const pageNum = parseInt(String(options.page || "0"), 10) || 0;
    const limitNum = parseInt(String(options.limit || "10"), 10) || 10;
    gsaParams.append("page", pageNum.toString());
    gsaParams.append("size", limitNum.toString());

    const url = `${this.baseUrl}/entities?${gsaParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`SAM.gov Remote API Code Exception (${response.status}): ${errText}`);
    }

    const rawData = (await response.json()) as any;
    const totalRecords = rawData.totalRecords || 0;
    const rawEntities = rawData.entityData || [];

    const parsedEntities: SAMEntity[] = rawEntities.map((item: any) => {
      const ueiSAM = item.entityRegistration?.ueiSAM || item.ueiSAM || "";
      const legalBusinessName =
        item.entityRegistration?.legalBusinessName ||
        item.legalBusinessName ||
        "Unknown legal business name";
      const dbaName = item.entityRegistration?.dbaName || undefined;
      let status: "Active" | "Inactive" | "Expired" | "ID Assigned" = "Active";

      const registrationStatus = item.entityRegistration?.registrationStatus || "";
      if (registrationStatus.toLowerCase().includes("expired")) {
        status = "Expired";
      } else if (registrationStatus.toLowerCase().includes("inactive")) {
        status = "Inactive";
      } else if (registrationStatus.toLowerCase().includes("active")) {
        status = "Active";
      } else {
        // If registrationStatus is missing or blank (standard for unregistered/ID Assigned), or contains "assigned"
        status = "ID Assigned";
      }

      const registrationDate = item.entityRegistration?.registrationDate || "";
      const activationDate = item.entityRegistration?.activationDate || "";
      const expirationDate = item.entityRegistration?.expirationDate || "";

      // physical Address mapping with safe fallback to entityRegistration physical address
      const pAddr = item.coreData?.physicalAddress || item.entityRegistration?.physicalAddress || {};
      const physicalAddress = {
        addressLine1: pAddr.addressLine1 || "",
        addressLine2: pAddr.addressLine2 || undefined,
        city: pAddr.city || "",
        stateOrProvinceCode: pAddr.stateOrProvinceCode || pAddr.stateOrProvince || "",
        zipCode: pAddr.zipCode || pAddr.zip || "",
        countryCode: pAddr.countryCode || "USA"
      };

      // business structure
      const bizTypes = item.coreData?.businessTypes || {};
      const businessTypeCodes = Array.isArray(bizTypes.businessTypeCode)
        ? bizTypes.businessTypeCode
        : [];
      const businessTypeDescriptions = Array.isArray(bizTypes.businessTypeDescription)
        ? bizTypes.businessTypeDescription
        : [];

      // NAICS industry sectors
      const rNaics = item.assertions?.naicsCodes || item.assertions?.naicsCode || [];
      const naicsCodes = (Array.isArray(rNaics) ? rNaics : [rNaics]).map((n: any) => ({
        naicsCode: n.naicsCode || "",
        naicsDescription: n.naicsDescription || "",
        primary: n.naicsCode === item.assertions?.primaryNaicsCode || n.primary === "Y",
        isSmallBusiness: n.isSmallBusiness === "Y" || n.smallBusinessIndicator === "Y"
      }));

      // PSC (Product Service Codes)
      const rPsc = item.assertions?.pscCodes || item.assertions?.pscCode || [];
      const pscCodes = (Array.isArray(rPsc) ? rPsc : [rPsc]).map((p: any) => ({
        pscCode: p.pscCode || "",
        pscDescription: p.pscDescription || ""
      }));

      // Exclusions debarment flag
      const excl = item.exclusions || item.exclusionInformation || {};
      const reg = item.entityRegistration || {};
      const hasExclusion =
        reg.hasKnownExclusion === "Y" ||
        reg.hasKnownExclusion === true ||
        reg.hasKnownExclusions === "Y" ||
        reg.hasKnownExclusions === true ||
        excl.hasExclusions === "Y" ||
        excl.hasExclusion === "Y" ||
        (excl.activeExclusCount && parseInt(excl.activeExclusCount, 10) > 0) ||
        (excl.activeExclusionCount && parseInt(excl.activeExclusionCount, 10) > 0);

      // Provisions, representations & certifications
      const rawRepAndCerts = item.repsAndCerts || item.repAndCerts || {};
      const provs = rawRepAndCerts.provisions || [];
      const mappedProvisions = Array.isArray(provs)
        ? provs.map((pv: any) => ({
            provisionId: pv.provisionId || "",
            title: pv.title || pv.provisionTitle || "",
            selectedResponse: pv.selectedResponse || "",
            description: pv.description || ""
          }))
        : [];

      return {
        ueiSAM,
        duns: item.entityRegistration?.duns || undefined,
        legalBusinessName,
        dbaName,
        status,
        registrationDate,
        activationDate,
        expirationDate,
        coreData: {
          entityInformation: {
            entityStartDate: item.coreData?.entityInformation?.entityStartDate,
            fiscalYearEndCloseDate: item.coreData?.entityInformation?.fiscalYearEndCloseDate,
            submissionDate: item.coreData?.entityInformation?.submissionDate,
            organizationStructureCode: item.coreData?.entityInformation?.organizationStructureCode,
            organizationStructureDesc: item.coreData?.entityInformation?.organizationStructureDesc,
            entityTypeCode: item.coreData?.entityInformation?.entityTypeCode,
            entityTypeDesc: item.coreData?.entityInformation?.entityTypeDesc,
            congressionalDistrict: item.coreData?.entityInformation?.congressionalDistrict
          },
          physicalAddress,
          businessTypes: {
            businessTypeCodes,
            businessTypeDescriptions
          }
        },
        assertions: {
          naicsCodes,
          pscCodes
        },
        repAndCerts: {
          hasRepsAndCerts:
            rawRepAndCerts.hasRepsAndCerts === "Y" || rawRepAndCerts.hasRepsAndCerts === true,
          provisions: mappedProvisions
        },
        exclusionDetails: {
          hasExclusion,
          exclusionType: hasExclusion ? "Active Exclusion Registered" : undefined,
          reason: hasExclusion
            ? "Active federal exclusion or enforcement proceeding recorded in SAM.gov"
            : undefined
        }
      };
    });

    return {
      totalRecords,
      entities: parsedEntities,
      page: pageNum,
      limit: limitNum,
      isMock: false
    };
  }
}
