import fs from 'node:fs';
import path from 'node:path';

function loadLocalEnvFile(): void {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadLocalEnvFile();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const SAUCEDEMO_BASE_URL = requireEnv('SAUCEDEMO_BASE_URL');
export const SAUCEDEMO_PASSWORD = requireEnv('SAUCEDEMO_PASSWORD');
export const SAUCEDEMO_PASSWORD_INVALID = requireEnv('SAUCEDEMO_PASSWORD_INVALID');

export const SAUCEDEMO_USERS = {
  standard: requireEnv('SAUCEDEMO_USER_STANDARD'),
  lockedOut: requireEnv('SAUCEDEMO_USER_LOCKED_OUT'),
  problem: requireEnv('SAUCEDEMO_USER_PROBLEM'),
  performanceGlitch: requireEnv('SAUCEDEMO_USER_PERFORMANCE_GLITCH'),
  error: requireEnv('SAUCEDEMO_USER_ERROR'),
  visual: requireEnv('SAUCEDEMO_USER_VISUAL'),
} as const;
