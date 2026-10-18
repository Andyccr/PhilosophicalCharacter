import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = path.join(root, 'dist');

// Local installs can reuse an existing dist. CI (including Workers Builds
// preview, which runs `npx wrangler preview` with an empty build command)
// must produce dist before wrangler looks at assets.directory.
if (existsSync(dist) && !process.env.CI) process.exit(0);

const result = spawnSync('npm', ['run', 'build'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});
process.exit(result.status ?? 1);
