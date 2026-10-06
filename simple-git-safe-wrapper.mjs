import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const simpleGit = require('simple-git');

// Safe wrapper: allowlist + blocklist for CVE-2026-102828 / 102829 class
const BLOCK_RE = /trailer\..*\.(cmd|command)|include|protocol\.allow|core\.editor|VISUAL|EDITOR|--exec|--receive-p|^-c$/i;

export function assertSafeConfig(configArray) {
  for (const c of configArray || []) {
    if (BLOCK_RE.test(String(c))) {
      throw new Error(`blocked unsafe git config: ${c}`);
    }
  }
}

export function safeGit(options = {}) {
  // keep blockUnsafeOperationsPlugin enabled (default in 4.0.1+), never disable
  const git = simpleGit({
    ...options,
    unsafe: undefined, // force default safe
  });
  return git;
}

// Example: never pass user input as -c / config keys directly
export async function safeCommit(repoPath, message) {
  assertSafeConfig([]);
  const git = safeGit(repoPath);
  // message is passed as argv, not shell — safe as long as config not attacker-controlled
  await git.commit(message);
}
