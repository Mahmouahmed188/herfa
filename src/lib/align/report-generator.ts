import * as fs from 'fs';
import * as path from 'path';
import { EndpointRecord, Mismatch, FixAction, AlignmentReport } from '../../types/alignment';

const REPORT_PATH = path.resolve(process.cwd(), 'docs/frontend-api-alignment-report.md');

interface ReportSections {
  correctIntegrations: EndpointRecord[];
  brokenIntegrations: Mismatch[];
  endpointMismatches: Mismatch[];
  dtoMismatches: Mismatch[];
  missingApiIntegrations: Mismatch[];
  mockImplementations: Mismatch[];
  requiredFixes: FixAction[];
}

function categorizeMismatches(mismatches: Mismatch[]): Omit<ReportSections, 'correctIntegrations'> {
  return {
    brokenIntegrations: mismatches.filter(m => !['mock_data', 'missing_integration'].includes(m.type)),
    endpointMismatches: mismatches.filter(m => ['wrong_path', 'wrong_method'].includes(m.type)),
    dtoMismatches: mismatches.filter(m => ['wrong_payload', 'wrong_response', 'dto_field_mismatch'].includes(m.type)),
    missingApiIntegrations: mismatches.filter(m => m.type === 'missing_integration'),
    mockImplementations: mismatches.filter(m => m.type === 'mock_data'),
    requiredFixes: [],
  };
}

function generateSection(title: string, content: string): string {
  return `## ${title}\n\n${content}\n`;
}

function endpointTable(endpoints: EndpointRecord[]): string {
  if (endpoints.length === 0) return 'No endpoints in this category.\n';
  let table = '| # | Source | Method | Path | Auth | File |\n|---|---|---|---|---|---|\n';
  endpoints.forEach((ep, i) => {
    table += `| ${i + 1} | ${ep.source} | ${ep.method} | ${ep.path} | ${ep.authRequired ? 'Yes' : 'No'} | ${ep.sourceFile} |\n`;
  });
  return table;
}

function mismatchTable(mismatches: Mismatch[]): string {
  if (mismatches.length === 0) return 'No mismatches in this category.\n';
  let table = '| # | Type | Frontend | Expected | Severity | Fix |\n|---|---|---|---|---|---|\n';
  mismatches.forEach((m, i) => {
    table += `| ${i + 1} | ${m.type} | ${m.frontendValue} | ${m.expectedValue} | ${m.severity} | ${m.fixClassification} |\n`;
  });
  return table;
}

function detailedMismatchList(mismatches: Mismatch[]): string {
  if (mismatches.length === 0) return 'No entries.\n';
  return mismatches.map(m =>
    `- **${m.id}**: ${m.fixDescription}\n  - File: \`${m.fixFile}\`${m.fixLine ? ` (line ${m.fixLine})` : ''}\n  - Frontend: \`${m.frontendValue}\` → Expected: \`${m.expectedValue}\`\n  - Severity: ${m.severity} | Fix: ${m.fixClassification}`
  ).join('\n');
}

export function generateReport(
  allEndpoints: EndpointRecord[],
  allMismatches: Mismatch[],
  allFixes: FixAction[],
): AlignmentReport {
  const categorized = categorizeMismatches(allMismatches);
  const correctEndpoints = allEndpoints.filter(ep =>
    !allMismatches.some(m => m.endpointId === ep.id || m.endpointId === 'all-core')
  );

  const report = new AlignmentReport();
  report.generatedAt = new Date().toISOString();
  report.totalEndpointsScanned = allEndpoints.length;
  report.correctIntegrations = correctEndpoints;
  report.brokenIntegrations = categorized.brokenIntegrations;
  report.endpointMismatches = categorized.endpointMismatches;
  report.dtoMismatches = categorized.dtoMismatches;
  report.missingApiIntegrations = categorized.missingApiIntegrations;
  report.mockImplementations = categorized.mockImplementations;
  report.requiredFixes = allFixes;
  report.autoFixesApplied = allFixes.filter(f => f.applied).length;
  report.remainingManualFixes = allFixes.filter(f => !f.applied && f.confidence !== 'high').length;

  return report;
}

export function writeReport(report: AlignmentReport): string {
  const lines: string[] = [];

  lines.push('# Frontend API Alignment Report');
  lines.push('');
  lines.push(`**Generated**: ${report.generatedAt}`);
  lines.push(`**Total Endpoints Scanned**: ${report.totalEndpointsScanned}`);
  lines.push(`**Auto-Fixes Applied**: ${report.autoFixesApplied}`);
  lines.push(`**Remaining Manual Fixes**: ${report.remainingManualFixes}`);
  lines.push('');

  lines.push('---');
  lines.push('');

  lines.push(generateSection('Correct Integrations', endpointTable(report.correctIntegrations)));

  lines.push('---');
  lines.push('');

  lines.push(generateSection('Broken Integrations', mismatchTable(report.brokenIntegrations)));

  lines.push('---');
  lines.push('');

  lines.push(generateSection('Endpoint Mismatches', mismatchTable(report.endpointMismatches)));

  lines.push('---');
  lines.push('');

  lines.push(generateSection('DTO Mismatches', mismatchTable(report.dtoMismatches)));

  lines.push('---');
  lines.push('');

  lines.push(generateSection('Missing API Integrations', detailedMismatchList(report.missingApiIntegrations)));

  lines.push('---');
  lines.push('');

  lines.push(generateSection('Mock Implementations', detailedMismatchList(report.mockImplementations)));

  lines.push('---');
  lines.push('');

  const fixLines: string[] = [];
  const autoFixes = report.requiredFixes.filter(f => f.applied);
  const manualFixes = report.requiredFixes.filter(f => !f.applied);

  if (autoFixes.length > 0) {
    fixLines.push('### Auto-Applied Fixes\n');
    fixLines.push('| # | Endpoint | Fix | File | Status |\n|---|---|---|---|---|\n');
    autoFixes.forEach((f, i) => {
      fixLines.push(`| ${i + 1} | ${f.mismatchId} | ${f.operation} | ${f.filePath} | Applied |\n`);
    });
  }

  if (manualFixes.length > 0) {
    fixLines.push('\n### Manual Fixes Required\n');
    fixLines.push('| # | Endpoint | Issue | Recommended Action | Effort |\n|---|---|---|---|---|\n');
    manualFixes.forEach((f, i) => {
      fixLines.push(`| ${i + 1} | ${f.mismatchId} | ${f.operation} | ${f.newValue} | Medium |\n`);
    });
  }

  lines.push(generateSection('Required Fixes', fixLines.join('')));

  const content = lines.join('\n');
  fs.writeFileSync(REPORT_PATH, content, 'utf-8');

  return REPORT_PATH;
}
