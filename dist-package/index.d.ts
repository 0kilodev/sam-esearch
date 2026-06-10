interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    stateOrProvinceCode: string;
    zipCode: string;
    countryCode: string;
}
interface BusinessTypes {
    businessTypeCodes: string[];
    businessTypeDescriptions: string[];
}
interface EntityInformation {
    entityStartDate?: string;
    fiscalYearEndCloseDate?: string;
    submissionDate?: string;
    organizationStructureCode?: string;
    organizationStructureDesc?: string;
    entityTypeCode?: string;
    entityTypeDesc?: string;
    congressionalDistrict?: string;
}
interface PhysicalAddress extends Address {
}
interface MailingAddress extends Address {
}
interface CoreData {
    entityInformation: EntityInformation;
    physicalAddress: PhysicalAddress;
    mailingAddress?: MailingAddress;
    businessTypes: BusinessTypes;
}
interface NaicsCode {
    naicsCode: string;
    naicsDescription: string;
    primary: boolean;
    isSmallBusiness?: boolean;
}
interface PscCode {
    pscCode: string;
    pscDescription: string;
}
interface Assertions {
    naicsCodes: NaicsCode[];
    pscCodes: PscCode[];
}
interface RepsAndCertsProvision {
    provisionId: string;
    title: string;
    selectedResponse: string;
    description?: string;
}
interface RepAndCerts {
    hasRepsAndCerts: boolean;
    provisions?: RepsAndCertsProvision[];
}
interface ExclusionDetails {
    hasExclusion: boolean;
    exclusionType?: string;
    activeDate?: string;
    reason?: string;
    authority?: string;
}
interface SAMEntity {
    ueiSAM: string;
    duns?: string;
    legalBusinessName: string;
    dbaName?: string;
    status: 'Active' | 'Inactive' | 'Expired';
    registrationDate: string;
    activationDate: string;
    expirationDate: string;
    coreData?: CoreData;
    assertions?: Assertions;
    repAndCerts?: RepAndCerts;
    exclusionDetails?: ExclusionDetails;
}
interface SAMQueryResponse {
    totalRecords: number;
    entities: SAMEntity[];
    page: number;
    limit: number;
    isMock?: boolean;
}

interface SamGovClientOptions {
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
interface SamGovSearchOptions {
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
     * The page offset to return (0-indexed)
     */
    page?: number | string;
    /**
     * Max records per page query
     */
    limit?: number | string;
}
declare class SamGovClient {
    private apiKey;
    private baseUrl;
    constructor(options?: SamGovClientOptions);
    /**
     * Get federal registration records filtered by UEI, name, state, and zip.
     */
    getEntities(options?: SamGovSearchOptions): Promise<SAMQueryResponse>;
}

export { type Address, type Assertions, type BusinessTypes, type CoreData, type EntityInformation, type ExclusionDetails, type MailingAddress, type NaicsCode, type PhysicalAddress, type PscCode, type RepAndCerts, type RepsAndCertsProvision, type SAMEntity, type SAMQueryResponse, SamGovClient, type SamGovClientOptions, type SamGovSearchOptions };
