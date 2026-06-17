import * as fs from 'fs';
import * as path from 'path';
import { EndpointRecord, HttpMethod } from '../../../types/alignment';

const CORE_API_PATH = path.resolve(process.cwd(), 'src/services/api.ts');

function inferMethodFromFunction(name: string, methodKeyword: string): HttpMethod {
  const upper = methodKeyword.toUpperCase();
  if (['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].includes(upper)) return upper as HttpMethod;
  if (name.startsWith('get') || name.startsWith('fetch')) return 'GET';
  if (name.startsWith('create') || name.startsWith('submit') || name.startsWith('send') || name.startsWith('register') || name.startsWith('login')) return 'POST';
  if (name.startsWith('update') || name.startsWith('mark')) return 'PATCH';
  if (name.startsWith('cancel') || name.startsWith('delete') || name.startsWith('reject')) return 'POST';
  if (name.startsWith('toggle') || name.startsWith('accept')) return 'POST';
  return 'GET';
}

function extractPathLiteral(line: string): string | null {
  const backtickMatch = line.match(/`([^`]+)`/);
  if (backtickMatch) return backtickMatch[1];
  const singleMatch = line.match(/'([^']+)'/);
  if (singleMatch && (singleMatch[1].startsWith('/') || singleMatch[1].startsWith('api'))) return singleMatch[1];
  const doubleMatch = line.match(/"([^"]+)"/);
  if (doubleMatch && (doubleMatch[1].startsWith('/') || doubleMatch[1].startsWith('api'))) return doubleMatch[1];
  return null;
}

function extractMethod(line: string): string | null {
  const match = line.match(/method:\s*['"](\w+)['"]/);
  return match ? match[1] : null;
}

function hasRequestBody(body: string): boolean {
  return body.includes('body: JSON.stringify') || body.includes('body: formData') || body.includes('data,') || body.includes('data)');
}

function hasAuthHeader(body: string): boolean {
  return body.includes('Authorization') || body.includes('getAuthHeaders') || body.includes('token');
}

export function scanCoreApi(): EndpointRecord[] {
  const content = fs.readFileSync(CORE_API_PATH, 'utf-8');
  const lines = content.split('\n');
  const endpoints: EndpointRecord[] = [];
  let currentFunction: string | null = null;
  let currentBody = '';
  let functionLineStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const exportMatch = line.match(/export\s+(async\s+)?function\s+(\w+)/);
    if (exportMatch) {
      if (currentFunction) {
        const pathLit = extractPathLiteral(currentBody);
        const methodStr = extractMethod(currentBody);
        if (pathLit) {
          endpoints.push({
            id: `core-${endpoints.length + 1}`,
            source: 'core',
            sourceFile: 'src/services/api.ts',
            functionName: currentFunction,
            method: (methodStr ? inferMethodFromFunction(currentFunction, methodStr) : inferMethodFromFunction(currentFunction, 'GET')) as HttpMethod,
            path: pathLit,
            pathParams: [],
            queryParams: [],
            authRequired: hasAuthHeader(currentBody),
            hasRequestBody: hasRequestBody(currentBody),
            responseType: 'any',
            lineNumber: functionLineStart,
            authSource: hasAuthHeader(currentBody) ? 'zustand' : 'none',
            hasDedicatedHook: false,
          });
        }
      }
      currentFunction = exportMatch[2];
      currentBody = '';
      functionLineStart = i + 1;
    }
    if (currentFunction) {
      currentBody += line + '\n';
    }
  }

  if (currentFunction) {
    const pathLit = extractPathLiteral(currentBody);
    const methodStr = extractMethod(currentBody);
    if (pathLit) {
      endpoints.push({
        id: `core-${endpoints.length + 1}`,
        source: 'core',
        sourceFile: 'src/services/api.ts',
        functionName: currentFunction,
        method: (methodStr ? inferMethodFromFunction(currentFunction, methodStr) : inferMethodFromFunction(currentFunction, 'GET')) as HttpMethod,
        path: pathLit,
        pathParams: [],
        queryParams: [],
        authRequired: hasAuthHeader(currentBody),
        hasRequestBody: hasRequestBody(currentBody),
        responseType: 'any',
        lineNumber: functionLineStart,
        authSource: hasAuthHeader(currentBody) ? 'zustand' : 'none',
        hasDedicatedHook: false,
      });
    }
  }

  return endpoints;
}

if (require.main === module) {
  const results = scanCoreApi();
  console.log(JSON.stringify(results, null, 2));
}
