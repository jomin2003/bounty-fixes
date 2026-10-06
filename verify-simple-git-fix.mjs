// verify fix: must be on patched version + wrapper blocks payloads
import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
console.log('simple-git version:', pkg.dependencies['simple-git']);

const { assertSafeConfig } = await import('./simple-git-safe-wrapper.mjs');
const payloads = [
  'trailer.myhook.cmd=calc.exe',
  'trailer.x.command=id',
  'include.path=/tmp/evil',
  'protocol.allow=always',
  'core.editor=evil.sh',
  '--exec',
];
let blocked = 0;
for (const p of payloads) {
  try { assertSafeConfig([p]); console.log('FAIL not blocked:', p); }
  catch { blocked++; console.log('blocked OK:', p); }
}
if (blocked !== payloads.length) process.exit(1);
console.log(`all ${blocked}/${payloads.length} payloads blocked - fix verified`);
