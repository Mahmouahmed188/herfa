import * as fs from 'fs';
import * as path from 'path';
import { EndpointRecord, HttpMethod } from '../../../types/alignment';

const FEATURE_SERVICES_DIR = path.resolve(process.cwd(), 'src/features');

function extractMethodFromLine(line: string): HttpMethod | null {
  const match = line.match(/\.(get|post|patch|put|delete)\b/);
  if (match) {
    const method = match[1].toUpperCase();
    return method as HttpMethod;
  }
  return null;
}

function extractPathFromLine(line: string): string | null {
  const backtickMatch = line.match(/`([^`]+)`/);
  if (backtickMatch) return backtickMatch[1];
  const quoteMatch = line.match(/['"]([^'"]+)['"]/);
  return quoteMatch ? quoteMatch[1] : null;
}

function hasRequestBody(method: HttpMethod, body: string): boolean {
  if (method === 'GET') return false;
  return body.includes('data') || body.includes('{') || body.includes('params');
}

function findServiceFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        results.push(...findServiceFiles(fullPath));
      }
    } else if (entry.name === 'api.ts') {
      const relPath = path.relative(FEATURE_SERVICES_DIR, fullPath);
      if (relPath.includes('services') || relPath.includes('api')) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

export function scanFeatureServices(): EndpointRecord[] {
  const endpoints: EndpointRecord[] = [];
  const serviceFiles = findServiceFiles(FEATURE_SERVICES_DIR);

  for (const fullPath of serviceFiles) {
    const relativePath = path.relative(FEATURE_SERVICES_DIR, fullPath);
    const moduleName = relativePath.split(path.sep)[0];
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const method = extractMethodFromLine(line);
      if (!method) continue;

      const endpointPath = extractPathFromLine(line);
      if (!endpointPath) continue;

      const bodyContext = lines.slice(Math.max(0, i - 2), i + 3).join('\n');

      endpoints.push({
        id: `feature-${moduleName}-${endpoints.length + 1}`,
        source: 'feature',
        sourceFile: `src/features/${moduleName}/services/api.ts`,
        functionName: `api.${moduleName} (line ${i + 1})`,
        method,
        path: endpointPath,
        pathParams: [],
        queryParams: [],
        authRequired: true,
        hasRequestBody: hasRequestBody(method, bodyContext),
        responseType: 'any',
        lineNumber: i + 1,
        authSource: 'zustand',
        hasDedicatedHook: false,
        featureModule: moduleName,
      });
    }
  }

  return endpoints;
}

if (require.main === module) {
  const results = scanFeatureServices();
  console.log(JSON.stringify(results, null, 2));
}
