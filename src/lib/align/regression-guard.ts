import * as fs from 'fs';
import { FixAction } from '../../types/alignment';

const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

export function validateFileAfterFix(filePath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!fs.existsSync(filePath)) {
    return { valid: false, errors: [`File not found: ${filePath}`] };
  }

  const ext = filePath.slice(filePath.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: true, errors: [] };
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  if (!content || content.trim().length === 0) {
    errors.push(`File is empty after fix: ${filePath}`);
    return { valid: false, errors };
  }

  if (content.includes('undefined') && !content.includes('typeof') && !content.includes('void 0')) {
    errors.push(`Warning: file contains 'undefined' references: ${filePath}`);
  }

  const exportCount = (content.match(/export /g) || []).length;
  if (exportCount === 0) {
    errors.push(`No exports found in ${filePath} — imports may be broken`);
  }

  const missingImports: string[] = [];
  const importMatches = content.matchAll(/from\s+['"]([^'"]+)['"]/g);
  for (const match of importMatches) {
    const importPath = match[1];
    if (importPath.startsWith('.') || importPath.startsWith('@/')) {
      const resolved = resolveImportPath(filePath, importPath);
      if (resolved && !fs.existsSync(resolved)) {
        missingImports.push(importPath);
      }
    }
  }

  if (missingImports.length > 0) {
    errors.push(`Missing imports in ${filePath}: ${missingImports.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function resolveImportPath(fromFile: string, importPath: string): string | null {
  const dir = fromFile.substring(0, fromFile.lastIndexOf('/'));
  const resolved = importPath.startsWith('@/')
    ? importPath.replace('@/', 'src/')
    : importPath.startsWith('.')
      ? `${dir}/${importPath}`
      : importPath;

  const candidates = [resolved, `${resolved}.ts`, `${resolved}.tsx`, `${resolved}/index.ts`, `${resolved}/index.tsx`];

  for (const candidate of candidates) {
    const absPath = candidate.startsWith('src/')
      ? process.cwd() + '/' + candidate
      : process.cwd() + '/src/' + candidate;
    if (fs.existsSync(absPath)) return absPath;
  }

  return null;
}

export function validateAllFixes(fixes: FixAction[]): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const allErrors: string[] = [];

  const appliedFixes = fixes.filter(f => f.applied);
  const uniqueFiles = [...new Set(appliedFixes.map(f => f.filePath))];

  for (const filePath of uniqueFiles) {
    const result = validateFileAfterFix(filePath);
    if (result.valid) {
      passed++;
    } else {
      failed++;
      allErrors.push(...result.errors);
    }
  }

  return { passed, failed, errors: allErrors };
}
