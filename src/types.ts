export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvinceCode: string;
  zipCode: string;
  countryCode: string;
}

export interface BusinessTypes {
  businessTypeCodes: string[];
  businessTypeDescriptions: string[];
}

export interface EntityInformation {
  entityStartDate?: string;
  fiscalYearEndCloseDate?: string;
  submissionDate?: string;
  organizationStructureCode?: string;
  organizationStructureDesc?: string;
  entityTypeCode?: string;
  entityTypeDesc?: string;
  congressionalDistrict?: string;
}

export interface PhysicalAddress extends Address {}
export interface MailingAddress extends Address {}

export interface CoreData {
  entityInformation: EntityInformation;
  physicalAddress: PhysicalAddress;
  mailingAddress?: MailingAddress;
  businessTypes: BusinessTypes;
}

export interface NaicsCode {
  naicsCode: string;
  naicsDescription: string;
  primary: boolean;
  isSmallBusiness?: boolean;
}

export interface PscCode {
  pscCode: string;
  pscDescription: string;
}

export interface Assertions {
  naicsCodes: NaicsCode[];
  pscCodes: PscCode[];
}

export interface RepsAndCertsProvision {
  provisionId: string;
  title: string;
  selectedResponse: string;
  description?: string;
}

export interface RepAndCerts {
  hasRepsAndCerts: boolean;
  provisions?: RepsAndCertsProvision[];
}

export interface ExclusionDetails {
  hasExclusion: boolean;
  exclusionType?: string;
  activeDate?: string;
  reason?: string;
  authority?: string;
}

export interface SAMEntity {
  ueiSAM: string;
  duns?: string;
  legalBusinessName: string;
  dbaName?: string;
  status: 'Active' | 'Inactive' | 'Expired' | 'ID Assigned';
  registrationDate: string;
  activationDate: string;
  expirationDate: string;
  coreData?: CoreData;
  assertions?: Assertions;
  repAndCerts?: RepAndCerts;
  exclusionDetails?: ExclusionDetails;
}

export interface SAMQueryResponse {
  totalRecords: number;
  entities: SAMEntity[];
  page: number;
  limit: number;
  isMock?: boolean;
}
