import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = path.join(root, 'dist');

// GitHub Actions (including Pages) already runs `npm run build` after `npm ci`.
if (process.env.GITHUB_ACTIONS) process.exit(0);

// Local installs can reuse an existing dist. Workers Builds preview runs
// `npx wrangler preview` with an empty dashboard build command, so produce
// dist here when it is missing.
if (existsSync(dist)) process.exit(0);

const result = spawnSync('npm', ['run', 'build'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});
process.exit(result.status ?? 1);
