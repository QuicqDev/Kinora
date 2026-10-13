import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawn } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const local = path.join(
  root,
  'node_modules/node/bin',
  process.platform === 'win32' ? 'node.exe' : 'node',
);
const runtime = existsSync(local) ? local : process.execPath;
const processes = [];
function run(args) {
  const child = spawn(runtime, args, { cwd: root, stdio: 'inherit', windowsHide: true });
  processes.push(child);
  child.once('error', () => {
    console.error('Could not start the app runtime. Run npm install first.');
    process.exitCode = 1;
  });
  return child;
}
const mode = process.argv[2];
if (mode === 'dev') {
  run(['--import', 'tsx', '--watch', 'server/index.ts']);
  run(['node_modules/vite/bin/vite.js']);
} else if (mode === 'start') run(['--import', 'tsx', 'server/index.ts']);
else if (mode === 'inspect') run(['--import', 'tsx', 'scripts/inspect.ts']);
else if (mode === 'coverage')
  run(['--import', 'tsx', 'scripts/coverage.ts', ...process.argv.slice(3)]);
else if (mode === 'audit')
  run(['--import', 'tsx', 'scripts/audit-live.ts', ...process.argv.slice(3)]);
else if (mode === 'smoke')
  run(['--import', 'tsx', 'scripts/smoke-live.ts', ...process.argv.slice(3)]);
else if (mode === 'warm')
  run(['--import', 'tsx', 'scripts/warm-live.ts', ...process.argv.slice(3)]);
else if (mode === 'profiles')
  run(['--import', 'tsx', 'scripts/profile-live.ts', ...process.argv.slice(3)]);
else if (mode === 'demo-check') run(['--import', 'tsx', 'scripts/demo-check.ts']);
else throw new Error('Choose dev, start, inspect, audit, smoke, warm, profiles or demo-check');
for (const signal of ['SIGINT', 'SIGTERM'])
  process.once(signal, () => {
    for (const child of processes) child.kill(signal);
  });
for (const child of processes)
  child.once('exit', (code) => {
    for (const sibling of processes) if (sibling !== child) sibling.kill();
    process.exitCode = code ?? 1;
  });
