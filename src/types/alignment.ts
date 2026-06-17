export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export type EndpointSource = 'core' | 'feature';

export type MismatchType =
  | 'wrong_path'
  | 'wrong_method'
  | 'wrong_payload'
  | 'wrong_response'
  | 'missing_auth'
  | 'dto_field_mismatch'
  | 'mock_data'
  | 'deprecated_api'
  | 'missing_integration';

export type FixClassification = 'safe' | 'requires_manual_intervention';

export type FixOperation =
  | 'replace_path'
  | 'replace_method'
  | 'rename_field'
  | 'update_auth_source'
  | 'replace_client'
  | 'wrap_response';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type Confidence = 'high' | 'medium' | 'low';

export interface EndpointRecord {
  id: string;
  source: EndpointSource;
  sourceFile: string;
  functionName: string;
  method: HttpMethod;
  path: string;
  pathParams: string[];
  queryParams: string[];
  authRequired: boolean;
  hasRequestBody: boolean;
  responseType: string;
  lineNumber: number;
  authSource: 'localStorage' | 'zustand' | 'none';
  hasDedicatedHook: boolean;
  hookFile?: string;
  featureModule?: string;
  usedInPages?: string[];
}

export interface FeatureServiceEndpoint {
  featureModule: string;
  serviceFile: string;
  method: HttpMethod;
  path: string;
  clientType: 'axios';
  requestBodyType: string;
  responseType: string;
  hasHook: boolean;
  hookFunctionNames: string[];
  queryKeyPattern: string;
}

export interface ReactQueryHook {
  filePath: string;
  functionName: string;
  type: 'query' | 'mutation';
  queryKey: string[];
  queryFn: string;
  targetEndpointPath: string;
  moduleName: string;
  lineNumber: number;
}

export interface Mismatch {
  id: string;
  endpointId: string;
  type: MismatchType;
  frontendValue: string;
  expectedValue: string;
  severity: Severity;
  fixClassification: FixClassification;
  fixDescription: string;
  fixFile: string;
  fixLine: number;
  requiresNewFeatureModule: boolean;
}

export interface FixAction {
  mismatchId: string;
  operation: FixOperation;
  filePath: string;
  oldValue: string;
  newValue: string;
  confidence: Confidence;
  applied: boolean;
  verified: boolean;
}

export class AlignmentReport {
  generatedAt: string = '';
  totalEndpointsScanned: number = 0;
  correctIntegrations: EndpointRecord[] = [];
  brokenIntegrations: Mismatch[] = [];
  endpointMismatches: Mismatch[] = [];
  dtoMismatches: Mismatch[] = [];
  missingApiIntegrations: Mismatch[] = [];
  mockImplementations: Mismatch[] = [];
  requiredFixes: FixAction[] = [];
  autoFixesApplied: number = 0;
  remainingManualFixes: number = 0;
}

export interface GapAnalysisContract {
  method: string;
  path: string;
  connected: string;
  hasHook: string;
  usedInUI: string;
  source: string;
}
