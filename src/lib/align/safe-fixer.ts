import * as fs from 'fs';
import { FixAction, EndpointRecord, Mismatch } from '../../types/alignment';

export function applySafeFix(fix: FixAction): boolean {
  if (!fs.existsSync(fix.filePath)) {
    console.warn(`[safe-fixer] File not found: ${fix.filePath}`);
    return false;
  }

  const content = fs.readFileSync(fix.filePath, 'utf-8');

  if (content.includes(fix.oldValue)) {
    const newContent = content.replace(fix.oldValue, fix.newValue);
    if (newContent !== content) {
      fs.writeFileSync(fix.filePath, newContent, 'utf-8');
      fix.applied = true;
      console.log(`[safe-fixer] Applied fix: ${fix.operation} in ${fix.filePath}`);
      return true;
    }
  }

  console.warn(`[safe-fixer] Pattern not found: "${fix.oldValue}" in ${fix.filePath}`);
  return false;
}

export function batchApplySafeFixes(fixes: FixAction[]): { applied: number; failed: number } {
  let applied = 0;
  let failed = 0;

  for (const fix of fixes) {
    if (fix.confidence !== 'high') {
      console.log(`[safe-fixer] Skipping low-confidence fix: ${fix.mismatchId}`);
      continue;
    }
    if (applySafeFix(fix)) {
      applied++;
    } else {
      failed++;
    }
  }

  return { applied, failed };
}

export function correctPath(
  filePath: string,
  oldPath: string,
  newPath: string,
  lineNumber?: number,
): boolean {
  if (!fs.existsSync(filePath)) {
    console.warn(`[path-correction] File not found: ${filePath}`);
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;

  const searchStart = lineNumber ? Math.max(0, lineNumber - 3) : 0;
  const searchEnd = lineNumber ? Math.min(lines.length, lineNumber + 3) : lines.length;

  for (let i = searchStart; i < searchEnd; i++) {
    const line = lines[i];
    if (line.includes(oldPath) && !line.includes('import')) {
      const quotedOld = ["'", '"', '`'].map(q => `${q}${oldPath}${q}`).find(q => line.includes(q));
      if (quotedOld) {
        const quotedNew = quotedOld.replace(oldPath, newPath);
        lines[i] = line.replace(quotedOld, quotedNew);
        modified = true;
        console.log(`[path-correction] Fixed path in ${filePath}:${i + 1} ${oldPath} → ${newPath}`);
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  }
  return modified;
}

export function correctMethod(
  filePath: string,
  expectedMethod: string,
  lineNumber?: number,
): boolean {
  if (!fs.existsSync(filePath)) {
    console.warn(`[method-correction] File not found: ${filePath}`);
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;

  const searchStart = lineNumber ? Math.max(0, lineNumber - 2) : 0;
  const searchEnd = lineNumber ? Math.min(lines.length, lineNumber + 2) : lines.length;

  for (let i = searchStart; i < searchEnd; i++) {
    const line = lines[i];
    const methodMatch = line.match(/method:\s*'(\w+)'/);
    if (methodMatch && methodMatch[1].toUpperCase() !== expectedMethod) {
      lines[i] = line.replace(`method: '${methodMatch[1]}'`, `method: '${expectedMethod}'`);
      modified = true;
      console.log(`[method-correction] Fixed method in ${filePath}:${i + 1} ${methodMatch[1]} → ${expectedMethod}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  }
  return modified;
}

export function addAuthHeaders(
  filePath: string,
): boolean {
  if (!fs.existsSync(filePath)) {
    console.warn(`[auth-fix] File not found: ${filePath}`);
    return false;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('fetchWithAuth') && line.includes('GET') && !line.includes('Authorization')) {
      lines[i] = line.replace(
        /(fetchWithAuth\('[^']+',\s*\{)\s*method:\s*'GET'\s*\}/,
        (match) => {
          const indent = match.match(/^\s*/)?.[0] || '';
          return `${indent}fetchWithAuth(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  })`;
        },
      );
      modified = true;
      console.log(`[auth-fix] Added auth headers in ${filePath}:${i + 1}`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  }
  return modified;
}

export function generateAndApplyFixes(
  endpoints: EndpointRecord[],
  mismatches: Mismatch[],
): FixAction[] {
  const fixes: FixAction[] = [];

  for (const mismatch of mismatches) {
    if (mismatch.fixClassification !== 'safe') continue;

    switch (mismatch.type) {
      case 'wrong_method': {
        const endpoint = endpoints.find(e => e.id === mismatch.endpointId);
        if (endpoint) {
          const applied = correctMethod(
            mismatch.fixFile,
            mismatch.expectedValue,
            mismatch.fixLine,
          );
          fixes.push({
            mismatchId: mismatch.id,
            operation: 'replace_method',
            filePath: mismatch.fixFile,
            oldValue: endpoint.method,
            newValue: mismatch.expectedValue,
            confidence: 'high',
            applied,
            verified: false,
          });
        }
        break;
      }
      case 'wrong_path': {
        const endpoint = endpoints.find(e => e.id === mismatch.endpointId);
        if (endpoint) {
          const applied = correctPath(
            mismatch.fixFile,
            mismatch.frontendValue,
            mismatch.expectedValue,
            mismatch.fixLine,
          );
          fixes.push({
            mismatchId: mismatch.id,
            operation: 'replace_path',
            filePath: mismatch.fixFile,
            oldValue: mismatch.frontendValue,
            newValue: mismatch.expectedValue,
            confidence: 'high',
            applied,
            verified: false,
          });
        }
        break;
      }
      case 'missing_auth': {
        const applied = addAuthHeaders(mismatch.fixFile);
        fixes.push({
          mismatchId: mismatch.id,
          operation: 'update_auth_source',
          filePath: mismatch.fixFile,
          oldValue: mismatch.frontendValue,
          newValue: mismatch.expectedValue,
          confidence: 'high',
          applied,
          verified: false,
        });
        break;
      }
      default:
        break;
    }
  }

  return fixes;
}
