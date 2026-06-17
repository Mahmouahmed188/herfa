import { scanCoreApi } from './scanners/core-api-scanner';
import { scanFeatureServices } from './scanners/feature-service-scanner';
import { scanHooks } from './scanners/hooks-scanner';
import { scanAxiosConfig } from './scanners/axios-scanner';
import { compareEndpoints, detectAuthInconsistency, detectMockImplementations, detectMissingFeatureModules, detectDisconnectedPages, detectKnownIssues } from './comparator';
import { generateReport, writeReport } from './report-generator';
import { classifyMismatch } from './fix-classifier';
import { generateAndApplyFixes } from './safe-fixer';
import { EndpointRecord, Mismatch } from '../../types/alignment';
import * as fs from 'fs';
import * as path from 'path';

const FRONTEND_PAGES_DIR = path.resolve(process.cwd(), 'src/app/[locale]');

function findFrontendPages(): string[] {
  const pages: string[] = [];
  const dirs = [
    '',
    '(auth)',
    '(customer)',
    '(provider)',
    '(admin)',
    '(dashboard)',
  ];

  for (const dir of dirs) {
    const searchPath = dir ? path.join(FRONTEND_PAGES_DIR, dir) : FRONTEND_PAGES_DIR;
    if (fs.existsSync(searchPath)) {
      const entries = fs.readdirSync(searchPath, { recursive: false, withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const pageFile = path.join(searchPath, entry.name, 'page.tsx');
          if (fs.existsSync(pageFile)) {
            pages.push(`/${dir}/${entry.name}`.replace(/\/\//g, '/'));
          }
        }
      }
    }
  }

  return pages;
}

export function runAudit(): { reportPath: string; totalEndpoints: number; mismatches: number; fixes: number } {
  console.log('=== Frontend API Alignment Audit ===');
  console.log('');

  console.log('[1/9] Scanning core API endpoints...');
  const coreEndpoints = scanCoreApi();
  console.log(`  Found ${coreEndpoints.length} core API endpoints`);

  console.log('[2/9] Scanning feature service endpoints...');
  const featureEndpoints = scanFeatureServices();
  console.log(`  Found ${featureEndpoints.length} feature service endpoints`);

  console.log('[3/9] Scanning React Query hooks...');
  const hooks = scanHooks();
  console.log(`  Found ${hooks.length} React Query hooks`);

  console.log('[4/9] Scanning Axios client configuration...');
  const axiosConfig = scanAxiosConfig();
  console.log(`  Base URL: ${axiosConfig.baseURL}`);
  console.log(`  Auth source: ${axiosConfig.authSource}`);

  console.log('[5/9] Loading backend contracts from gap analysis...');
  try {
    const testEndpoints: EndpointRecord[] = [];
    compareEndpoints(testEndpoints);
    console.log(`  Backend contracts loaded successfully`);
  } catch (e) {
    console.log(`  Warning: Could not parse all contracts: ${e}`);
  }

  console.log('[6/9] Comparing frontend endpoints against backend contracts...');
  const allEndpoints = [...coreEndpoints, ...featureEndpoints];
  const endpointMismatches = compareEndpoints(allEndpoints);
  console.log(`  Found ${endpointMismatches.length} endpoint mismatches`);

  console.log('[7/9] Detecting additional issues...');
  const mockMismatches = detectMockImplementations();
  const authMismatches = detectAuthInconsistency(allEndpoints);
  const featureModuleMismatches = detectMissingFeatureModules();
  const disconnectedMismatches = detectDisconnectedPages();
  const knownMismatches = detectKnownIssues();
  console.log(`  Found ${mockMismatches.length} mock implementation(s)`);
  console.log(`  Found ${authMismatches.length} auth inconsistency(ies)`);
  console.log(`  Found ${featureModuleMismatches.length} missing feature module(s)`);
  console.log(`  Found ${disconnectedMismatches.length} disconnected page(s)`);
  console.log(`  Found ${knownMismatches.length} known issue(s)`);

  const allMismatches: Mismatch[] = [
    ...endpointMismatches,
    ...mockMismatches,
    ...authMismatches,
    ...featureModuleMismatches,
    ...disconnectedMismatches,
    ...knownMismatches,
  ];

  console.log('[8/9] Classifying mismatches and generating fix actions...');
  for (const mismatch of allMismatches) {
    mismatch.fixClassification = classifyMismatch(mismatch);
  }
  const fixes = generateAndApplyFixes(allEndpoints, allMismatches);
  console.log(`  ${fixes.filter(f => f.applied).length} safe fixes applied`);
  console.log(`  ${fixes.filter(f => !f.applied && f.confidence === 'high').length} safe fixes identified (not applied)`);
  console.log(`  ${allMismatches.length - fixes.length} items require manual intervention`);

  console.log('[9/9] Generating alignment report...');
  const report = generateReport(allEndpoints, allMismatches, fixes);
  const reportPath = writeReport(report);

  console.log('');
  console.log('=== Audit Complete ===');
  console.log(`Report: ${reportPath}`);
  console.log(`Total endpoints scanned: ${allEndpoints.length}`);
  console.log(`Total mismatches: ${allMismatches.length}`);
  console.log(`Safe fixes available: ${fixes.filter(f => f.confidence === 'high').length}`);
  console.log(`Manual fixes needed: ${allMismatches.length - fixes.filter(f => f.confidence === 'high').length}`);

  return {
    reportPath,
    totalEndpoints: allEndpoints.length,
    mismatches: allMismatches.length,
    fixes: fixes.length,
  };
}

if (require.main === module) {
  runAudit();
}
