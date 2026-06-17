import * as fs from 'fs';
import * as path from 'path';
import { ReactQueryHook } from '../../../types/alignment';

const FEATURES_DIR = path.resolve(process.cwd(), 'src/features');

function isQueryHook(line: string): boolean {
  return line.includes('useQuery(');
}

function isMutationHook(line: string): boolean {
  return line.includes('useMutation(');
}

function extractFunctionName(line: string): string | null {
  const match = line.match(/export\s+function\s+(\w+)/);
  return match ? match[1] : null;
}

function extractQueryFnName(body: string): string | null {
  const queryFnMatch = body.match(/queryFn:\s*(\w+(?:\.\w+)*)/);
  if (queryFnMatch) return queryFnMatch[1];
  const mutationFnMatch = body.match(/mutationFn:\s*(\w+(?:\.\w+)*)/);
  if (mutationFnMatch) return mutationFnMatch[1];
  return null;
}

function extractQueryKey(body: string): string[] {
  const matches = body.match(/queryKey:\s*\[([^\]]+)\]/);
  if (!matches) return [];
  return matches[1].split(',').map(k => k.trim().replace(/['"]/g, ''));
}

function findHookFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && !entry.name.startsWith('.')) {
        results.push(...findHookFiles(fullPath));
      }
    } else if (entry.name.endsWith('.ts') && fullPath.includes(path.sep + 'hooks' + path.sep)) {
      results.push(fullPath);
    }
  }
  return results;
}

function toRelative(absPath: string, base: string): string {
  const rel = path.relative(base, absPath).replace(/\\/g, '/');
  return 'src/features/' + rel;
}

export function scanHooks(): ReactQueryHook[] {
  const hooks: ReactQueryHook[] = [];
  const hookFiles = findHookFiles(FEATURES_DIR);

    for (const fullPath of hookFiles) {
    const relativeFile = toRelative(fullPath, FEATURES_DIR);
    const moduleName = path.relative(FEATURES_DIR, fullPath).split(path.sep)[0];
    const content = fs.readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');

    let currentFunction: string | null = null;
    let currentBody = '';
    let functionLineStart = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('export function') || line.includes('export const')) {
        if (currentFunction && currentBody) {
          const type = isMutationHook(currentBody) ? 'mutation' : isQueryHook(currentBody) ? 'query' : null;
          const queryFnName = extractQueryFnName(currentBody);
          if (type && queryFnName) {
            hooks.push({
              filePath: relativeFile,
              functionName: currentFunction,
              type,
              queryKey: extractQueryKey(currentBody),
              queryFn: queryFnName,
              targetEndpointPath: '',
              moduleName,
              lineNumber: functionLineStart,
            });
          }
        }
        currentFunction = extractFunctionName(line);
        currentBody = '';
        functionLineStart = i + 1;
      }

      if (currentFunction) {
        currentBody += line + '\n';
      }
    }

    if (currentFunction && currentBody) {
      const type = isMutationHook(currentBody) ? 'mutation' : isQueryHook(currentBody) ? 'query' : null;
      const queryFnName = extractQueryFnName(currentBody);
      if (type && queryFnName) {
        hooks.push({
          filePath: relativeFile,
          functionName: currentFunction,
          type,
          queryKey: extractQueryKey(currentBody),
          queryFn: queryFnName,
          targetEndpointPath: '',
          moduleName,
          lineNumber: functionLineStart,
        });
      }
    }
  }

  return hooks;
}

if (require.main === module) {
  const results = scanHooks();
  console.log(JSON.stringify(results, null, 2));
}
