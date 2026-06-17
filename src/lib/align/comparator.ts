import { EndpointRecord, Mismatch } from '../../types/alignment';
import * as fs from 'fs';
import * as path from 'path';

const GAP_ANALYSIS_PATH = path.resolve(process.cwd(), 'docs/frontend-business-gap-analysis.md');

interface BackendContract {
  method: string;
  path: string;
  connected: string;
  hasHook: string;
  usedInUI: string;
  source: string;
}

function parseBackendContracts(): BackendContract[] {
  const contracts: BackendContract[] = [];
  const content = fs.readFileSync(GAP_ANALYSIS_PATH, 'utf-8');
  const lines = content.split('\n');
  let inMatrix = false;

  for (const line of lines) {
    if (line.includes('| Method | Route | Connected | Has Hook | Used In UI | Source |')) {
      inMatrix = true;
      continue;
    }
    if (inMatrix) {
      if (line.startsWith('|---')) continue;
      if (!line.startsWith('|')) {
        inMatrix = false;
        continue;
      }
      const parts = line.split('|').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 6) {
        contracts.push({
          method: parts[0].toUpperCase(),
          path: '/api/v1' + parts[1],
          connected: parts[2],
          hasHook: parts[3],
          usedInUI: parts[4],
          source: parts[5],
        });
      }
    }
  }

  return contracts;
}

function normalizePath(path: string): string {
  const normalized = path
    .replace(/^\${.*?}\/?/, '')
    .replace(/^\/api\/v1/, '')
    .replace(/\$\{(id|userId|providerId|tenderId|offerId|messageId|assignmentId|categoryId)\}/g, ':id')
    .replace(/:\w+/g, ':id')
    .replace(/\?.*$/, '');
  return normalized;
}

function pathsMatch(frontendPath: string, contractPath: string): boolean {
  const fp = normalizePath(frontendPath);
  const cp = normalizePath(contractPath);
  const fpParts = fp.split('/').filter(Boolean);
  const cpParts = cp.split('/').filter(Boolean);
  if (fpParts.length !== cpParts.length) return false;
  return fpParts.every((part, i) => part === cpParts[i] || part === ':id' || cpParts[i] === ':id');
}

export function compareEndpoints(frontendEndpoints: EndpointRecord[]): Mismatch[] {
  const mismatches: Mismatch[] = [];
  const backendContracts = parseBackendContracts();

  for (const endpoint of frontendEndpoints) {
    const exactMatch = backendContracts.find(c =>
      pathsMatch(endpoint.path, c.path) && c.method === endpoint.method
    );

    if (exactMatch) {
      continue;
    }

    const matchingContract = backendContracts.find(c => pathsMatch(endpoint.path, c.path));

    if (!matchingContract) {
      mismatches.push({
        id: `mm-${mismatches.length + 1}`,
        endpointId: endpoint.id,
        type: 'missing_integration',
        frontendValue: `${endpoint.method} ${endpoint.path}`,
        expectedValue: 'No matching backend contract found',
        severity: 'medium',
        fixClassification: 'requires_manual_intervention',
        fixDescription: `Frontend endpoint ${endpoint.method} ${endpoint.path} in ${endpoint.sourceFile} has no matching backend contract.`,
        fixFile: endpoint.sourceFile,
        fixLine: endpoint.lineNumber,
        requiresNewFeatureModule: endpoint.source === 'core' && !endpoint.featureModule,
      });
      continue;
    }

    mismatches.push({
      id: `mm-${mismatches.length + 1}`,
      endpointId: endpoint.id,
      type: 'wrong_method',
      frontendValue: endpoint.method,
      expectedValue: matchingContract.method,
      severity: 'high',
      fixClassification: 'safe',
      fixDescription: `Method ${endpoint.method} should be ${matchingContract.method} for ${endpoint.path}`,
      fixFile: endpoint.sourceFile,
      fixLine: endpoint.lineNumber,
      requiresNewFeatureModule: false,
    });
  }

  return mismatches;
}

export function detectAuthInconsistency(endpoints: EndpointRecord[]): Mismatch[] {
  const mismatches: Mismatch[] = [];
  const localStorageEndpoints = endpoints.filter(e => e.authSource === 'localStorage');

  if (localStorageEndpoints.length > 0) {
    mismatches.push({
      id: 'mm-auth-001',
      endpointId: 'all-core',
      type: 'missing_auth',
      frontendValue: `localStorage.getItem('token') in src/services/api.ts (${localStorageEndpoints.length} endpoints)`,
      expectedValue: `useAuthStore.getState().token (consistent with src/lib/axios.ts pattern)`,
      severity: 'high',
      fixClassification: 'safe',
      fixDescription: 'Auth token source mismatch: core API uses localStorage while Axios uses Zustand store. Standardize to Zustand store.',
      fixFile: 'src/services/api.ts',
      fixLine: 6,
      requiresNewFeatureModule: false,
    });
  }

  return mismatches;
}

export function detectMockImplementations(): Mismatch[] {
  const mismatches: Mismatch[] = [];

  const aiDiagnosisPath = path.resolve(process.cwd(), 'src/app/[locale]/ai-diagnosis');
  if (fs.existsSync(aiDiagnosisPath)) {
    mismatches.push({
      id: 'mm-mock-001',
      endpointId: 'mock-ai-diagnosis',
      type: 'mock_data',
      frontendValue: 'Mock AI diagnosis data',
      expectedValue: 'Real AI Gateway endpoint',
      severity: 'high',
      fixClassification: 'requires_manual_intervention',
      fixDescription: '/ai-diagnosis page uses mock data instead of real AI Gateway API. Needs integration with AI Gateway endpoint when available.',
      fixFile: 'src/app/[locale]/ai-diagnosis/',
      fixLine: 0,
      requiresNewFeatureModule: false,
    });
  }

  const savedPath = path.resolve(process.cwd(), 'src/app/[locale]/client/saved');
  if (fs.existsSync(savedPath)) {
    mismatches.push({
      id: 'mm-mock-002',
      endpointId: 'mock-client-saved',
      type: 'mock_data',
      frontendValue: 'localStorage-based favorites',
      expectedValue: 'Backend favorites/provider bookmarking API',
      severity: 'medium',
      fixClassification: 'requires_manual_intervention',
      fixDescription: '/client/saved uses localStorage instead of backend API for favorites. Needs backend favorites endpoint and integration.',
      fixFile: 'src/app/[locale]/client/saved/',
      fixLine: 0,
      requiresNewFeatureModule: false,
    });
  }

  return mismatches;
}

export function detectMissingFeatureModules(): Mismatch[] {
  const mismatches: Mismatch[] = [];
  const coreApiPath = path.resolve(process.cwd(), 'src/services/api.ts');

  interface DomainInfo {
    id: string;
    name: string;
    functions: string[];
    pages: string[];
  }

  const domains: DomainInfo[] = [
    {
      id: 'feature-jobs',
      name: 'Jobs',
      functions: ['getMyJobs', 'createJob', 'getJobById', 'cancelJob', 'getAssignedJobs', 'getAvailableJobs', 'acceptJob', 'rejectJob', 'updateJobStatus'],
      pages: ['/client/jobs', '/technician/jobs', '/admin/jobs'],
    },
    {
      id: 'feature-tenders',
      name: 'Tenders',
      functions: ['createTender', 'getMyTenders', 'getOpenTenders', 'getTenderById', 'updateTender', 'cancelTender'],
      pages: ['/tenders/create', '/tenders/[id]'],
    },
    {
      id: 'feature-messages',
      name: 'Messages',
      functions: ['getMyMessages', 'getConversation', 'sendMessage', 'markMessageRead'],
      pages: ['/technician/messages'],
    },
    {
      id: 'feature-offers',
      name: 'Offers',
      functions: ['submitOffer', 'getTenderOffers', 'acceptOffer', 'rejectOffer', 'getMyOffersTechnician'],
      pages: ['/technician/offers'],
    },
  ];

  for (const domain of domains) {
    mismatches.push({
      id: `mm-${domain.id}`,
      endpointId: `domain-${domain.name.toLowerCase()}`,
      type: 'missing_integration',
      frontendValue: `${domain.functions.length} core API functions without dedicated feature module`,
      expectedValue: `Dedicated feature module under src/features/${domain.name.toLowerCase()}/`,
      severity: 'high',
      fixClassification: 'requires_manual_intervention',
      fixDescription: `${domain.name} has no feature module — ${domain.functions.length} core API functions (${domain.functions.join(', ')}) used directly. Create src/features/${domain.name.toLowerCase()}/ with services/, hooks/, components/, schemas/, types/ subdirectories. Pages affected: ${domain.pages.join(', ')}.`,
      fixFile: `src/features/${domain.name.toLowerCase()}/`,
      fixLine: 0,
      requiresNewFeatureModule: true,
    });
  }

  return mismatches;
}

export function detectDisconnectedPages(): Mismatch[] {
  const mismatches: Mismatch[] = [];

  const disconnectedPages: { path: string; description: string; requiredEndpoint: string; priority: string }[] = [
    { path: '/client/profile', description: 'Profile page exists but no API integration for user profile updates', requiredEndpoint: 'PATCH /users/me or dedicated profile endpoint', priority: 'P2' },
    { path: '/technician/profile', description: 'Technician profile page exists but no API integration for updating profile/skills', requiredEndpoint: 'PATCH /providers/:id or dedicated profile endpoint', priority: 'P2' },
    { path: '/technician/earnings', description: 'Earnings page exists but not connected to finance/payouts API', requiredEndpoint: 'GET /finance/payouts or /admin/dashboard/revenue', priority: 'P2' },
    { path: '/client/wallet', description: 'Wallet page exists but no backend integration for balance/payment history', requiredEndpoint: 'GET /finance/wallet or dedicated wallet endpoint', priority: 'P2' },
  ];

  for (const page of disconnectedPages) {
    mismatches.push({
      id: `mm-disconnected-${page.path.replace(/\//g, '-').replace(/^-/, '')}`,
      endpointId: `page-${page.path}`,
      type: 'missing_integration',
      frontendValue: `${page.path} — page exists but is disconnected`,
      expectedValue: page.requiredEndpoint,
      severity: 'medium',
      fixClassification: 'requires_manual_intervention',
      fixDescription: `${page.description}. Required endpoint: ${page.requiredEndpoint}. Priority: ${page.priority}.`,
      fixFile: `src/app/[locale]${page.path}/`,
      fixLine: 0,
      requiresNewFeatureModule: false,
    });
  }

  return mismatches;
}

export function detectKnownIssues(): Mismatch[] {
  const mismatches: Mismatch[] = [];

  mismatches.push({
    id: 'mm-known-analytics-prefix',
    endpointId: 'feature-analytics-conversion',
    type: 'wrong_path',
    frontendValue: 'GET /analytics/conversion-funnel',
    expectedValue: 'GET /admin/analytics/conversion-funnel (if admin-only endpoint)',
    severity: 'medium',
    fixClassification: 'requires_manual_intervention',
    fixDescription: 'analyticsApi.getConversionFunnel() at src/features/analytics/services/api.ts uses /analytics/conversion-funnel which lacks /admin/ prefix. All other admin analytics endpoints use /admin/ prefix. Verify if this endpoint is admin-only and update the path accordingly.',
    fixFile: 'src/features/analytics/services/api.ts',
    fixLine: 45,
    requiresNewFeatureModule: false,
  });

  mismatches.push({
    id: 'mm-known-moderate-review',
    endpointId: 'feature-support-moderate',
    type: 'wrong_method',
    frontendValue: 'api.delete() with request body',
    expectedValue: 'POST /admin/reviews/:id/moderate (standard pattern)',
    severity: 'low',
    fixClassification: 'requires_manual_intervention',
    fixDescription: 'supportApi.moderateReview() at src/features/support/services/api.ts uses api.delete() with { data: ... } which is non-standard. Consider switching to POST with request body for better compatibility with NestJS backend conventions.',
    fixFile: 'src/features/support/services/api.ts',
    fixLine: 76,
    requiresNewFeatureModule: false,
  });

  return mismatches;
}

export { parseBackendContracts };
export type { BackendContract };
