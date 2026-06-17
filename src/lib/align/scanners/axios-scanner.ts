import * as fs from 'fs';
import * as path from 'path';

const AXIOS_PATH = path.resolve(process.cwd(), 'src/lib/axios.ts');

export interface AxiosConfig {
  baseURL: string;
  hasAuthInterceptor: boolean;
  authSource: string;
  hasResponseInterceptor: boolean;
  errorHandling: string;
  headers: Record<string, string>;
}

export function scanAxiosConfig(): AxiosConfig {
  const content = fs.readFileSync(AXIOS_PATH, 'utf-8');

  const baseURLMatch = content.match(/baseURL:\s*['"]([^'"]+)['"]/);
  const baseURL = baseURLMatch ? baseURLMatch[1] : '';

  const hasRequestInterceptor = content.includes('interceptors.request');
  const hasResponseInterceptor = content.includes('interceptors.response');

  const authSource = content.includes('useAuthStore.getState().token')
    ? 'zustand'
    : content.includes('localStorage')
      ? 'localStorage'
      : 'none';

  const contentTypeMatch = content.match(/'Content-Type':\s*'([^']+)'/);
  const contentType = contentTypeMatch ? contentTypeMatch[1] : 'application/json';

  const has401Logout = content.includes('status === 401') || content.includes('status===401');

  return {
    baseURL,
    hasAuthInterceptor: hasRequestInterceptor,
    authSource,
    hasResponseInterceptor,
    errorHandling: has401Logout ? '401 auto-logout enabled' : 'no 401 handling',
    headers: {
      'Content-Type': contentType,
    },
  };
}

if (require.main === module) {
  const config = scanAxiosConfig();
  console.log(JSON.stringify(config, null, 2));
}
