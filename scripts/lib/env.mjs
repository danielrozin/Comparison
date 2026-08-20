/**
 * Load .env.local into process.env for standalone scripts.
 *
 * Vercel injects env in production, but a script run straight from the shell
 * gets nothing. Every module that needs a key imports this rather than relying
 * on the entry point having done it — otherwise a helper silently takes its
 * no-key fallback path and the failure looks like a bad model response.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let loaded = false;

export function loadEnv() {
  if (loaded) return;
  loaded = true;
  try {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    for (const name of ['.env.local', '.env']) {
      const file = path.join(root, name);
      if (!fs.existsSync(file)) continue;
      for (const line of fs.readFileSync(file, 'utf-8').split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
      }
    }
  } catch {}
}

loadEnv();
